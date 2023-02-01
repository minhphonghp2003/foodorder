"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.image);
            this.belongsToMany(models.product, { through: models.product_category });
        }
    }
    category.init(
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "category",
        }
    );
    return category;
};
