"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("table_bookings", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                references: {
                    model: "users", // name of Target model
                    key: "id", // key in Target model that we're referencing
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            date: {
                type: Sequelize.DATE,
            },
            time: {
                type: Sequelize.TIME,
            },
            adult: {
                type: Sequelize.INTEGER,
            },
            kid: {
                type: Sequelize.INTEGER,
            },
            message: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("table_bookings");
    },
};
