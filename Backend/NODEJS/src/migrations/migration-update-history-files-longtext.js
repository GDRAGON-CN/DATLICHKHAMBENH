'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('histories', 'files', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('histories', 'files', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  }
};
