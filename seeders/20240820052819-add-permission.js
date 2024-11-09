'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    await queryInterface.bulkInsert('permissions', [{
      permission_name: 'Manage Dialects',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {ignoreDuplicates: false });

    await queryInterface.bulkInsert('permissions', [{
      permission_name: 'Manage Students',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {ignoreDuplicates: false });

    await queryInterface.bulkInsert('permissions', [{
      permission_name: 'Generate Reports',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {ignoreDuplicates: false });
    
    await queryInterface.bulkInsert('permissions', [{
      permission_name: 'Manage Words',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {ignoreDuplicates: false });

    await queryInterface.bulkInsert('permissions', [{
      permission_name: 'Manage Users',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {ignoreDuplicates: false });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
