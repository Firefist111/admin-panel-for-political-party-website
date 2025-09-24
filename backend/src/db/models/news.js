const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const news = sequelize.define(
    'news',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

headline: {
        type: DataTypes.TEXT,

      },

content: {
        type: DataTypes.TEXT,

      },

published_date: {
        type: DataTypes.DATE,

      },

category: {
        type: DataTypes.ENUM,

        values: [

"Development",

"Activities",

"PressReleases"

        ],

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  news.associate = (db) => {

    db.news.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.news.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return news;
};

