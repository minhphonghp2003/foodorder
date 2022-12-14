'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_addresses', {
      
      default: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      cusId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'customers', // name of Target model
          key: 'cus_id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      addrId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,

        type: Sequelize.UUID,
        references: {
          model: 'addresses', // name of Target model
          key: 'addr_id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('customer_addresses');
  }
};