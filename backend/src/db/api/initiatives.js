
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InitiativesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const initiatives = await db.initiatives.create(
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

        category: data.category
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return initiatives;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const initiativesData = data.map((item, index) => ({
                id: item.id || undefined,

                title: item.title
            ||
            null
            ,

                description: item.description
            ||
            null
            ,

                category: item.category
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const initiatives = await db.initiatives.bulkCreate(initiativesData, { transaction });

        return initiatives;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const initiatives = await db.initiatives.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.title !== undefined) updatePayload.title = data.title;

        if (data.description !== undefined) updatePayload.description = data.description;

        if (data.category !== undefined) updatePayload.category = data.category;

        updatePayload.updatedById = currentUser.id;

        await initiatives.update(updatePayload, {transaction});

        return initiatives;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const initiatives = await db.initiatives.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of initiatives) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of initiatives) {
                await record.destroy({transaction});
            }
        });

        return initiatives;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const initiatives = await db.initiatives.findByPk(id, options);

        await initiatives.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await initiatives.destroy({
            transaction
        });

        return initiatives;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const initiatives = await db.initiatives.findOne(
            { where },
            { transaction },
        );

        if (!initiatives) {
            return initiatives;
        }

        const output = initiatives.get({plain: true});

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
                            'initiatives',
                            'title',
                            filter.title,
                        ),
                    };
                }

                if (filter.description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'initiatives',
                            'description',
                            filter.description,
                        ),
                    };
                }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.category) {
                where = {
                    ...where,
                category: filter.category,
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
            const { rows, count } = await db.initiatives.findAndCountAll(queryOptions);

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
                        'initiatives',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.initiatives.findAll({
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

