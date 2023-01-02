'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.category)
      this.hasMany(models.product_review)
      this.belongsToMany(models.image, { through: models.product_image })
      this.belongsToMany(models.user, { through: models.cart })
      this.belongsToMany(models.user, { through: models.order })
      this.belongsToMany(models.reviewer, { through: models.product_review })
    }
  }
  product.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
   
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};