"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.oauthauthen);
            this.belongsToMany(models.address, {
                through: models.customer_address,
            });
        
            this.belongsToMany(models.product, {
                through: models.cart,
            });
            this.hasMany(models.customer_address);
            this.hasMany(models.cart);
        }
    }
    user.init(
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
            role: {
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
            },

            email: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: "user",
        }
    );
    return user;
};
