'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.payment)
      this.belongsTo(models.size)
      this.belongsTo(models.address)
    }
  }
  order.init({
    prodId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    cusId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    quanity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};