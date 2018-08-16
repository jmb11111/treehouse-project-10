'use strict';
//id an integer, title a string, author a string, 
//genre a string and first_published an integer
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    first_name: {type: DataTypes.STRING,
    validate:{
        notEmpty: {
      msg: 'Patron name is required!'
      }
    }
  },
  last_name: {type: DataTypes.STRING,
    validate:{
        notEmpty: {
      msg: 'Patron name is required!'
      }
    }
  },
    address: {type: DataTypes.STRING,
      validate:{
        notEmpty: {
      msg: 'address  is required!'
      }
    }
  },  
    email:{type: DataTypes.STRING,
      validate:{
        notEmpty: {
      msg: 'Email is required!'
      }
    }
  },  
    library_id:{type: DataTypes.INTEGER,
      validate:{
        notEmpty: {
      msg: 'Year published is required!'
        },
        isInt: {
          msg:'Please Enter A Valid number'
        }
      }
    } ,  
    zip:{type: DataTypes.INTEGER,
      validate:{
        notEmpty: {
      msg: 'Year published is required!'
        },
        isInt: {
          msg:'Please Enter A Valid number'
        }
      }
    } 
  }, {});
  Patron.associate = function(models) {
    // associations can be defined here
  };
  return Patron;
};