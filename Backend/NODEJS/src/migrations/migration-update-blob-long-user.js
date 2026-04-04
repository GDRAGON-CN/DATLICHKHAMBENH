// Source - https://stackoverflow.com/a/62669213
// Posted by Arpit Vyas
// Retrieved 2026-03-23, License - CC BY-SA 4.0

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        "Users",
        "image",
        {
          type: Sequelize.BLOB("long"),
          allowNull: true,
        },
        {},
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        "Users",
        "image",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        {},
      ),
    ]);
  },
};
