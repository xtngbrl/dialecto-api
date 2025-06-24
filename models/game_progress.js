
'use strict'
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class GameProgress extends Model {
    static associate(models){
      GameProgress.belongsTo(models.users, {
        foreignKey: 'user_id',
      })
    }
  }

  GameProgress.init({
 user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users', 
        key: 'id'
      }
  },
  gameType: {
    type: DataTypes.ENUM('shoot', 'jumbled', 'match', 'quiz'),
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastPlayed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  details: {
    type: DataTypes.JSONB
  }
}, {
  timestamps: true,
  sequelize,
  modelName: 'game_progress',
  tableName: 'game_progress'
});
return GameProgress;
}
