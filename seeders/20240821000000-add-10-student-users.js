'use strict';
const { faker } = require('@faker-js/faker'); // library for creating random fake names 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'Student' LIMIT 1;`
    );
    if (!roles.length) throw new Error("'Student' role not found");
    const studentRoleId = roles[0].id;

    // Create 10 students
    const users = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const password = 'student123'; 
      users.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        username: faker.internet.username() + Date.now() + i,
        email: faker.internet.email(),
        password: bcrypt.hashSync(password, 10), // hashes the test passwords for security 
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('users', users, { returning: true });

    // Get the new users
    const [insertedUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM users ORDER BY id DESC LIMIT 10;`
    );

    // Assign student roles to newly created users
    const usersRoles = insertedUsers.map(user => ({
      user_id: user.id,
      role_id: studentRoleId,
      createdAt: now,
      updatedAt: now
    }));
    await queryInterface.bulkInsert('users_roles', usersRoles);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 10 most recently created users and their role assignments
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users ORDER BY id DESC LIMIT 10;`
    );
    const userIds = users.map(u => u.id);
    if (userIds.length) {
      await queryInterface.bulkDelete('users_roles', { user_id: userIds });
      await queryInterface.bulkDelete('users', { id: userIds });
    }
  }
};
