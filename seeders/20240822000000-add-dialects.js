'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  

    await queryInterface.bulkInsert('dialects', [
      {
        dialect_name: 'Waray',
        dialect_description: 'The Waray language is part of the Austronesian language family and is spoken throughout Samar Island, with some variations between the dialects of Eastern, Northern, and Western Samar. They are the most culturally conservative of the Visayans.',
        no_of_games: 6,
        dialect_status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
       },
       {
        dialect_name: 'Kapampangan',
        dialect_description: "Kapampangan is derived from the root word pampáng ('riverbank'). The language was historically spoken in the Kingdom of Tondo, ruled by the Lakans. A number of Kapampangan dictionaries and grammar books were written during the Spanish colonial period.",
        no_of_games: 6,
        dialect_status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
       },
       {
        dialect_name: 'Cebuano',
        dialect_description: "The Cebuano language is a descendant of the hypothesized reconstructed Proto-Philippine language, which in turn descended from Proto-Malayo-Polynesian, making it distantly related to many languages in Maritime Southeast Asia, including Indonesian and Malay.",
        no_of_games: 6,
        dialect_status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
       },
       {
        dialect_name: 'Ilocano',
        dialect_description: "The Ilocano language, also known as Iloco, belongs to the Austronesian language family, specifically within the Malayo-Polynesian branch. It is widely believed to have originated in Taiwan through the Out of Taiwan migration theory.",
        no_of_games: 6,
        dialect_status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
       },
         {
        dialect_name: 'Bicolano',
        no_of_games: 6,
        dialect_status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
       },
         {
        dialect_name: 'Maranao',
        no_of_games: 6,
        dialect_status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
       },

    

      
      
      ], {});

       
  },

  async down (queryInterface, Sequelize) {
  

    await queryInterface.bulkDelete('dialects', null, {});
  }
};
