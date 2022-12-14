'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      prod_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      categoryId: {

        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories", 
          key: 'cate_id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false

      },
      price: {
        type: Sequelize.STRING,
        allowNull: false

      },
      description: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('products');
  }
};