
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class LeadersDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const leaders = await db.leaders.create(
            {
                id: data.id || undefined,

        name: data.name
        ||
        null
            ,

        position: data.position
        ||
        null
            ,

        bio: data.bio
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return leaders;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const leadersData = data.map((item, index) => ({
                id: item.id || undefined,

                name: item.name
            ||
            null
            ,

                position: item.position
            ||
            null
            ,

                bio: item.bio
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const leaders = await db.leaders.bulkCreate(leadersData, { transaction });

        return leaders;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const leaders = await db.leaders.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.name !== undefined) updatePayload.name = data.name;

        if (data.position !== undefined) updatePayload.position = data.position;

        if (data.bio !== undefined) updatePayload.bio = data.bio;

        updatePayload.updatedById = currentUser.id;

        await leaders.update(updatePayload, {transaction});

        return leaders;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const leaders = await db.leaders.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of leaders) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of leaders) {
                await record.destroy({transaction});
            }
        });

        return leaders;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const leaders = await db.leaders.findByPk(id, options);

        await leaders.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await leaders.destroy({
            transaction
        });

        return leaders;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const leaders = await db.leaders.findOne(
            { where },
            { transaction },
        );

        if (!leaders) {
            return leaders;
        }

        const output = leaders.get({plain: true});

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

                if (filter.name) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'leaders',
                            'name',
                            filter.name,
                        ),
                    };
                }

                if (filter.position) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'leaders',
                            'position',
                            filter.position,
                        ),
                    };
                }

                if (filter.bio) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'leaders',
                            'bio',
                            filter.bio,
                        ),
                    };
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
            const { rows, count } = await db.leaders.findAndCountAll(queryOptions);

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
                        'leaders',
                        'name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.leaders.findAll({
            attributes: [ 'id', 'name' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['name', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.name,
        }));
    }

};

