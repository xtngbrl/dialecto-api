const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FlaggedWord extends Model {
    static associate(models) {
      // Association: FlaggedWord belongs to Dialect
      FlaggedWord.belongsTo(models.dialects, {
        foreignKey: 'dialect_id',
        as: 'dialect',
        onDelete: 'CASCADE',
      });
    }
  }
  FlaggedWord.init(
    {
      dialect_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'dialects', // Table name
          key: 'id',
        },
      },
      word: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'flagged_words',
      timestamps: true,
    }
  );
  return FlaggedWord;
};
