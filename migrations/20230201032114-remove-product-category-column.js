'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.removeColumn('products', 'categoryId', { /* query options */ });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('products', 'categoryId', { type: Sequelize.INTEGER});


    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
