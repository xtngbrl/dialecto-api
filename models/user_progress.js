'use strict';
const {Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProgress extends Model {
    static associate(models) {
      UserProgress.belongsTo(models.users, { foreignKey: 'user_id' });
      UserProgress.belongsTo(models.dialects, { foreignKey: 'dialect_id' });
    }
  }

  UserProgress.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    dialect_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'dialects', key: 'id' }
    },
    dialect_progress: {
      type: DataTypes.FLOAT, // percentage (0-100)
      allowNull: false,
      defaultValue: 0
    },
    game_progress_percentages: {
      type: DataTypes.JSONB, // e.g. { shoot: 80, jumbled: 60, match: 100, quiz: 50 }
      allowNull: false,
      defaultValue: {}
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
