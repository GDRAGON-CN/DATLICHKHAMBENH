"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      handbookId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Comments");
  },
};
