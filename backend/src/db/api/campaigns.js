
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CampaignsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const campaigns = await db.campaigns.create(
            {
                id: data.id || undefined,

        title: data.title
        ||
        null
            ,

        description: data.description
        ||
        null
            ,

        start_date: data.start_date
        ||
        null
            ,

        end_date: data.end_date
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return campaigns;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const campaignsData = data.map((item, index) => ({
                id: item.id || undefined,

                title: item.title
            ||
            null
            ,

                description: item.description
            ||
            null
            ,

                start_date: item.start_date
            ||
            null
            ,

                end_date: item.end_date
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const campaigns = await db.campaigns.bulkCreate(campaignsData, { transaction });

        return campaigns;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const campaigns = await db.campaigns.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.title !== undefined) updatePayload.title = data.title;

        if (data.description !== undefined) updatePayload.description = data.description;

        if (data.start_date !== undefined) updatePayload.start_date = data.start_date;

        if (data.end_date !== undefined) updatePayload.end_date = data.end_date;

        updatePayload.updatedById = currentUser.id;

        await campaigns.update(updatePayload, {transaction});

        return campaigns;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const campaigns = await db.campaigns.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of campaigns) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of campaigns) {
                await record.destroy({transaction});
            }
        });

        return campaigns;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const campaigns = await db.campaigns.findByPk(id, options);

        await campaigns.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await campaigns.destroy({
            transaction
        });

        return campaigns;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const campaigns = await db.campaigns.findOne(
            { where },
            { transaction },
        );

        if (!campaigns) {
            return campaigns;
        }

        const output = campaigns.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.title) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'campaigns',
                            'title',
                            filter.title,
                        ),
                    };
                }

                if (filter.description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'campaigns',
                            'description',
                            filter.description,
                        ),
                    };
                }

            if (filter.start_dateRange) {
                const [start, end] = filter.start_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    start_date: {
                    ...where.start_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    start_date: {
                    ...where.start_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.end_dateRange) {
                const [start, end] = filter.end_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    end_date: {
                    ...where.end_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    end_date: {
                    ...where.end_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.campaigns.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'campaigns',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.campaigns.findAll({
            attributes: [ 'id', 'title' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['title', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.title,
        }));
    }

};

