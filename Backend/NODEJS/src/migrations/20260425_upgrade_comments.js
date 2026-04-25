"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Comments", "doctorId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Comments", "bookingId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Comments", "isApproved", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
    // Change handbookId to nullable
    await queryInterface.changeColumn("Comments", "handbookId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Comments", "doctorId");
    await queryInterface.removeColumn("Comments", "bookingId");
    await queryInterface.removeColumn("Comments", "isApproved");
    await queryInterface.changeColumn("Comments", "handbookId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
