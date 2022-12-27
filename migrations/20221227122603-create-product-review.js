"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("product_reviews", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            productId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: "products", // name of Target model
                    key: "id", // key in Target model that we're referencing
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            reviewerId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: "reviewers", // name of Target model
                    key: "id", // key in Target model that we're referencing
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            rating: {
                type: Sequelize.INTEGER,
            },
            content: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable("product_reviews");
    },
};
