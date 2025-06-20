'use strict'
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Leaderboard extends Model {
    static associate(models){
      Leaderboard.belongsTo(models.users, {
        foreignKey: 'user_id',
      });
    }
  }

  Leaderboard.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    gameType: {
      type: DataTypes.ENUM('shoot', 'jumbled', 'match'),
      allowNull: false
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
        fields: ['gameType', 'total_score'],
        order: [['gameType', 'ASC'], ['total_score', 'DESC']]
      }
    ]
  });
  return Leaderboard;
};