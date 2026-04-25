"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Handbook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Handbook.hasMany(models.Comment, { foreignKey: "handbookId", as: "commentData" });
    }
  }
  Handbook.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      descriptionMarkdown: DataTypes.TEXT,
      descriptionHTML: DataTypes.TEXT,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Handbook",
      tableName: "Clinics",
    },
  );
  return Handbook;
};
