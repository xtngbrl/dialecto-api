const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust path if your sequelize instance is elsewhere

const GameProgress = sequelize.define('GameProgress', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gameType: {
    type: DataTypes.ENUM('shoot', 'jumbled', 'match'),
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
  timestamps: true
});

module.exports = GameProgress;



'use strict'
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class GameProgress extends Model {
    static associate(models){
      GameProgress.belongsTo(models.users, {
        foreignKey: 'userId',
      })
    }
  }

  
}
