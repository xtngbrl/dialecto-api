'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('leaderboards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      gameType: {
        type: Sequelize.ENUM('shoot', 'jumbled', 'match', 'quiz'),
        allowNull: false
      },
      total_score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      achievedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    await queryInterface.addIndex('leaderboards', ['gameType', 'total_score']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('leaderboards');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leaderboards_gameType";');
  }
};
