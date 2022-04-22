'use strict';

module.exports = {
  async up (queryInterface, Sequelize) { 
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@mail.com",
          password:
            "$2a$10$f/IikFhRJEkPJymEu2wcrOcwnlSt4DEKinZSU0TeDL6PGkJgFzMEW", //admin123
          name: "admin",
          status: "admin",
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
