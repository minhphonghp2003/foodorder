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
        await queryInterface.addColumn("table_bookings", "name", {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn("table_bookings", "phone", {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn("table_bookings", "adult", {
            type: Sequelize.INTEGER,
        });
        await queryInterface.addColumn("table_bookings", "kid", {
            type: Sequelize.INTEGER,
        });
        await queryInterface.removeColumn("table_bookings", "userId", {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("table_bookings", "name", {});
        await queryInterface.removeColumn("table_bookings", "phone", {});
        await queryInterface.removeColumn("table_bookings", "adult", {});
        await queryInterface.removeColumn("table_bookings", "kid", {});
    },
};
