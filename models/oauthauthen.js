'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class oauthauthen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    this.belongsTo(models.user)
    }
  }
  oauthauthen.init({
   
    userId:DataTypes.UUID, 
    third_party_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'oauthauthen',
  });
  return oauthauthen;
};