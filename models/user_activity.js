'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserActivity extends Model {
    static associate(models) {
      UserActivity.belongsTo(models.users, { foreignKey: 'user_id' });
    }
  }

  UserActivity.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'user_activity',
    timestamps: true
  });

  return UserActivity;
};
