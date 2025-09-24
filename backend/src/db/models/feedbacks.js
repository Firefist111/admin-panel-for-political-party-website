const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const feedbacks = sequelize.define(
    'feedbacks',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

name: {
        type: DataTypes.TEXT,

      },

email: {
        type: DataTypes.TEXT,

      },

message: {
        type: DataTypes.TEXT,

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

  feedbacks.associate = (db) => {

    db.feedbacks.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.feedbacks.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return feedbacks;
};

