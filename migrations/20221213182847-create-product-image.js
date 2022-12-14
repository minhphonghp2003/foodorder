'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
      productId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'products', // 'Movies' would also work
          allowNull: false,
          key: 'prod_id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      imageId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "images", // 'Movies' would also work
          allowNull: false,
          key: 'img_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      shape: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('product_images');
  }
};