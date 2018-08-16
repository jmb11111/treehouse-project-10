'use strict';
//id an integer, title a string, author a string, 
//genre a string and first_published an integer
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre:DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define("project", {
//     name: DataTypes.STRING,
//     description: DataTypes.TEXT
//   })
// }