'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_image.init({
    shape: DataTypes.STRING,
    imageId: {
      type: DataTypes.INTEGER,
     
    },
    productId: {
      type: DataTypes.UUID,
      
    },
  }, {
    sequelize,
    modelName: 'product_image',
  });
  return product_image;
};