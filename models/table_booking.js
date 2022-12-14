'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class table_booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.customer)
    }
  }
  table_booking.init({
    date: {
        allowNull:false,
        type: DataTypes.TEXT
      },

    time: {
        allowNull:false,
        type: DataTypes.TEXT
      },

    message: {
        allowNull:false,
        type: DataTypes.TEXT
      },

  }, {
    sequelize,
    modelName: 'table_booking',
  });
  return table_booking;
};