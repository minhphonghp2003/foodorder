'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      cus_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        references: {
          model: 'customers',
          allowNull: false,
          key: 'cus_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: Sequelize.UUID
      },

      prod_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        references: {
          model: 'products',
          allowNull: false,
          key: 'prod_id'
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: Sequelize.UUID
      },

      sizeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sizes',
          allowNull: false,
          key: 'size_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      paymentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'payments',
          allowNull: false,
          key: 'pay_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addressId: {
        type: Sequelize.UUID,
        references: {
          model: 'addresses',
          allowNull: false,
          key: 'addr_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quanity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      discount: {
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
    await queryInterface.dropTable('orders');
  }
};