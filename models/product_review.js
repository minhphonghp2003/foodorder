"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class product_review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.reviewer)
        }
    }
    product_review.init(
        {
            productId: DataTypes.UUID,
            reviewerId: DataTypes.UUID,
            rating: DataTypes.INTEGER,
            content: DataTypes.TEXT,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "product_review",
        }
    );
    return product_review;
};
