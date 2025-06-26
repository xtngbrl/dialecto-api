'use strict'
const {Model} = require('sequelize');

module.exports  = (sequelize, DataTypes) => {

  class Dialect extends Model {
    static associate(models) {
      Dialect.hasMany(models.words, {
        foreignKey: 'dialect_id',
      })
    }
  }

  Dialect.init({
        dialect_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dialect_description: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Description unavailable — this dialect has not been added to the game yet." 
        },
        no_of_games: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        dialect_status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false
        }
    }, {
        timestamps:true,
        sequelize,
        modelName: 'dialects',
    });

  return Dialect;
}