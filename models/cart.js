'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cart.init({
    quanity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};