"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.table_booking);
            this.belongsToMany(models.address, {
                through: models.customer_address,
            });
            this.hasMany(models.customer_address);
        }
    }
    customer.init(
        {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            phone: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },

            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "customer",
        }
    );
    return customer;
};
