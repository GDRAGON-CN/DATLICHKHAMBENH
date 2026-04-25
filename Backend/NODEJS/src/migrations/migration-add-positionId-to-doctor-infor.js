"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Doctor_Infor", "positionId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Doctor_Infor", "positionId");
  },
};
