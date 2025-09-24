
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class NewsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const news = await db.news.create(
            {
                id: data.id || undefined,

        headline: data.headline
        ||
        null
            ,

        content: data.content
        ||
        null
            ,

        published_date: data.published_date
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

        return news;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const newsData = data.map((item, index) => ({
                id: item.id || undefined,

                headline: item.headline
            ||
            null
            ,

                content: item.content
            ||
            null
            ,

                published_date: item.published_date
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
        const news = await db.news.bulkCreate(newsData, { transaction });

        return news;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const news = await db.news.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.headline !== undefined) updatePayload.headline = data.headline;

        if (data.content !== undefined) updatePayload.content = data.content;

        if (data.published_date !== undefined) updatePayload.published_date = data.published_date;

        if (data.category !== undefined) updatePayload.category = data.category;

        updatePayload.updatedById = currentUser.id;

        await news.update(updatePayload, {transaction});

        return news;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const news = await db.news.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of news) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of news) {
                await record.destroy({transaction});
            }
        });

        return news;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const news = await db.news.findByPk(id, options);

        await news.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await news.destroy({
            transaction
        });

        return news;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const news = await db.news.findOne(
            { where },
            { transaction },
        );

        if (!news) {
            return news;
        }

        const output = news.get({plain: true});

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

                if (filter.headline) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'news',
                            'headline',
                            filter.headline,
                        ),
                    };
                }

                if (filter.content) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'news',
                            'content',
                            filter.content,
                        ),
                    };
                }

            if (filter.published_dateRange) {
                const [start, end] = filter.published_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    published_date: {
                    ...where.published_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    published_date: {
                    ...where.published_date,
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
            const { rows, count } = await db.news.findAndCountAll(queryOptions);

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
                        'news',
                        'headline',
                        query,
                    ),
                ],
            };
        }

        const records = await db.news.findAll({
            attributes: [ 'id', 'headline' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['headline', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.headline,
        }));
    }

};

