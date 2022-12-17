"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class pass_reset_email extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    pass_reset_email.init(
        {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "pass_reset_email",
        }
    );
    return pass_reset_email;
};
