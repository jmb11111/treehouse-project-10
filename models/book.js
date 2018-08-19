'use strict';
//id an integer, title a string, author a string, 
//genre a string and first_published an integer
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {type: DataTypes.STRING,
    validate:{
        notEmpty: {
      msg: 'Book Title is required!'
      }
    }
  },
    author: {type: DataTypes.STRING,
      validate:{
        notEmpty: {
      msg: 'Author  is required!'
      }
    }
  },  
    genre:{type: DataTypes.STRING,
      validate:{
        notEmpty: {
      msg: 'Genre is required!'
      }
    }
  },  
    first_published:{type: DataTypes.INTEGER,
      validate:{
        notEmpty: {
      msg: 'Year published is required!'
        },
        isInt: {
          msg:'Please Enter A Valid Year ex"1994"'
        }
      }
    } 
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};

