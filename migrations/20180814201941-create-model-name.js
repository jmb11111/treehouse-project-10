'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Loans',
      "PatronId",
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Patrons', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Loans', // name of Source model
      'PatronId' // key we want to remove
    );
  }
};