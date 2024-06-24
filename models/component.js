'use strict';
const {Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Component.hasMany(BorrowedComponent)
      Component.hasMany(models.BorrowedComponent, {
        foreignKey: 'componentUUID',
        sourceKey: 'uuid'
      });
    }
  }
  Component.init({
    uuid: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue:Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,

    },
    componentName: { 
      type:DataTypes.STRING,
      allowNull:false,
      require:true
    },
    componentType: { 
      type:DataTypes.STRING,
      allowNull:false,
      require:true
    },
    partNumber: { 
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      require:true
    },
    quantity: { 
      type:DataTypes.INTEGER,
      allowNull:false,
      require:true
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false
      
    },
    condition:{
      type:DataTypes.BOOLEAN,
      allowNull:false

    },
    conditionDetails:{
      type:DataTypes.TEXT,
      allowNull:true

    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },

  }, {
    sequelize,
    modelName: 'Component',
  });
  return Component;
};