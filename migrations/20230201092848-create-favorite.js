"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("favorites", {
            userId: {
                type: Sequelize.UUID,
                primaryKey:true,
                references: {
                    model: "users", // 'Movies' would also work
                    allowNull: false,
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            productId: {
                primaryKey:true,
                type: Sequelize.UUID,
                references: {
                    model: "products", // 'Movies' would also work
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
        await queryInterface.dropTable("favorites");
    },
};
