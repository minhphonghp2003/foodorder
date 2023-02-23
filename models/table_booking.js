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
    this.belongsTo(models.user)
    }
  }
  table_booking.init({
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    adult: DataTypes.INTEGER,
    kid: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'table_booking',
  });
  return table_booking;
};