'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carts', {

      productId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'products', // 'Movies' would also work
          allowNull: false,
          key: 'prod_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: 'customers', // 'Movies' would also work
          allowNull: false,
          key: 'cus_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

        primaryKey: true,
        allowNull: false
      },
      quanity: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('carts');
  }
};