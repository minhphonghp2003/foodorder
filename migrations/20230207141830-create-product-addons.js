"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("product_addons", {
            
            productId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: "products", // 'Movies' would also work
                    allowNull: false,
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            orderId: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: "orders", // 'Movies' would also work
                    allowNull: false,
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("product_addons");
    },
};
