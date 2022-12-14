'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order)
    }
  }
  size.init({
    name: {
        type: DataTypes.STRING,
        allowNull:false,
      },
  }, {
    sequelize,
    modelName: 'size',
  });
  return size;
};