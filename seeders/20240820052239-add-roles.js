'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  

    await queryInterface.bulkInsert('roles', [
      {
        role_name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
       },

       {
        role_name: 'Teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
       },

       {
        role_name: 'Student',
        createdAt: new Date(),
        updatedAt: new Date(),
       },

      
      
      ], {});

       
  },

  async down (queryInterface, Sequelize) {
  

    await queryInterface.bulkDelete('roles', null, {});
  }
};
