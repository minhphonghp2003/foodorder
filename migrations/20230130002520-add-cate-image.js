"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.addColumn("categories", "imageId", {
            type: Sequelize.INTEGER,
            references: {
                model: "images", // 'Movies' would also work
                // allowNull: false,
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("categories", "image");
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
