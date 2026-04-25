"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "userId", as: "userData" });
      Comment.belongsTo(models.Handbook, { foreignKey: "handbookId", as: "handbookData" });
      Comment.belongsTo(models.User, { foreignKey: "doctorId", as: "doctorData" });
      Comment.belongsTo(models.Booking, { foreignKey: "bookingId", as: "bookingData" });
    }
  }
  Comment.init(
    {
      handbookId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      bookingId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      isApproved: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
