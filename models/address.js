'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsToMany(models.customer,{ through: models.customer_address })
    }
  }
  address.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    street: DataTypes.STRING,
    commune_ward: DataTypes.STRING,
    city: DataTypes.STRING,
    district: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'address',
    tableName:'address',
  });
  return address;
};