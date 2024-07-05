'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComponentsQuantity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ComponentsQuantity.init({
    uuid: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue:Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    componentUUID: {
      type: DataTypes.UUID,
      references: {
        model: 'Components',
        key: 'uuid'
      },
      allowNull: false
    },
    quantity:{
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'ComponentsQuantity',
  });
  return ComponentsQuantity;
};