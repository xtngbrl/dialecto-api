'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dialects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dialect_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dialect_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      no_of_games: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      dialect_status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dialects');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_dialects_dialect_status";');
  }
};
