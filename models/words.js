'use strict'
const {Model} = require('sequelize');

module.exports  = (sequelize, DataTypes) => {

  class Word extends Model {
    static associate(models) {
      Word.belongsToOne(models.dialects, {
        foreignKey: 'dialect_id',
      })
    }
  }

  Word.init({
   dialect_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dialects', 
        key: 'id'
      }
    },
    word_text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps:true,
    sequelize,
    modelName: 'words',
  });

  return Word;
}