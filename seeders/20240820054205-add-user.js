'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('users', [
      {
      first_name: 'Admin',
      last_name: 'User',
      username: 'admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync("password", 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      first_name: 'Teacher',
      last_name: 'Sample',
      username: 'teacher',
      email: 'teacher@gmail.com',
      password: bcrypt.hashSync("password", 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      first_name: 'Sample',
      last_name: 'Student',
      username: 'student',
      email: 'student@gmail.com',
      password: bcrypt.hashSync("password", 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },

  
  ], {});
  },

  async down (queryInterface, Sequelize) {
  
    await queryInterface.bulkDelete('users', null, {});
  }
};
