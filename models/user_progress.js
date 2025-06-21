'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProgress extends Model {
    static associate(models) {
      UserProgress.belongsTo(models.users, { foreignKey: 'user_id' });
    }
  }

  UserProgress.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'user_progress',
    timestamps: true
  });

  return UserProgress;
};
