'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_progress', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id'},
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'
      },
      dialect_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'dialects', key: 'id' },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE'
      },
      dialect_progress: {
        type: Sequelize.FLOAT, // percentage (0-100)
        allowNull: false,
        defaultValue: 0
      },
      game_progress_percentages: {
        type: Sequelize.JSONB, // e.g. { shoot: 80, jumbled: 60, match: 100, quiz: 50 }
        allowNull: false,
        defaultValue: {}
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      progress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_progress');
  }
};