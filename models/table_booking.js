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
    tab_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    date: {
      allowNull: false,
      type: DataTypes.TEXT
    },

    time: {
      allowNull: false,
      type: DataTypes.TEXT
    },

    message: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      
    },

  }, {
    sequelize,
    modelName: 'table_booking',
  });
  return table_booking;
};