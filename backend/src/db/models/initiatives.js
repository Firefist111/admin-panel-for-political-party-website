const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const initiatives = sequelize.define(
    'initiatives',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,

      },

description: {
        type: DataTypes.TEXT,

      },

category: {
        type: DataTypes.ENUM,

        values: [

"WomenEmpowerment",

"Infrastructure",

"LocalInitiatives"

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

  initiatives.associate = (db) => {

    db.initiatives.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.initiatives.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return initiatives;
};

