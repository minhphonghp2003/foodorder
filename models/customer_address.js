'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.address)
    }
  }
  customer_address.init({
    customerId: {
      allowNull: false,
      type: DataTypes.UUID,
      
    },
    addressId: {
      allowNull: false,
      type: DataTypes.UUID,
     
    },
    default: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    }
  }, {
    sequelize,
    modelName: 'customer_address',
  });
  return customer_address;
};