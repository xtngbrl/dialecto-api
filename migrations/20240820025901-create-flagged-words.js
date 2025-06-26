'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flagged_words', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dialect_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'dialects', key: 'id'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      word: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('flagged_words');
  },
};
