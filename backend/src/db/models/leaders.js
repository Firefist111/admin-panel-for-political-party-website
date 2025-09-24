const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const leaders = sequelize.define(
    'leaders',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

name: {
        type: DataTypes.TEXT,

      },

position: {
        type: DataTypes.TEXT,

      },

bio: {
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

  leaders.associate = (db) => {

    db.leaders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.leaders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return leaders;
};

