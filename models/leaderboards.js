'use strict'
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Leaderboard extends Model {
    static associate(models){
      Leaderboard.hasMany(models.game_progress, {
        foreignKey: 'game_id'
      })
    }
  }

  Leaderboard.init({
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'game_progress', 
        key: 'id'
      }
    },
    total_score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    achievedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true, 
    sequelize,
    modelName: 'leaderboards',
    indexes: [
      {
        fields: ['total_score'],
        order: [['total_score', 'DESC']]
      }
    ]
  });
};