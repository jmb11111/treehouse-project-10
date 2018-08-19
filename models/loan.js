'use strict';
//id an integer, title a string, author a string, 
//genre a string and first_published an integer

//The loans table should have the following columns: id (integer), book_id (integer), patron_id (integer), 
//loaned_on (date), return_by (date) and returned_on (date).
module.exports = (sequelize, DataTypes) => {
    var Loan = sequelize.define('Loan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        loaned_on: {
            type: DataTypes.DATEONLY,
            validate: {
                notEmpty: {
                    msg: 'Todays date is required!'
                },
                isDate: {
                    msg: 'Please enter a valid date!'
                }
            }
        },
        due_on: {
            type: DataTypes.DATEONLY,
            validate: {
                notEmpty: {
                    msg: 'Due Date is required!'
                },
                isDate: {
                    msg: 'Please enter a valid date!'
                }
            }
        },
        returned_on: {
            type: DataTypes.DATEONLY,
            validate: {
                notEmpty: {
                    msg: 'Return date is required!'
                },
                isDate: {
                    msg: 'Please enter a valid date!'
                }
            }
        },
        book_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'Book ID is required!'
                }
            }
        }
    }, {});
    Loan.associate = function (models) {
        Loan.belongsTo(models.Patron);

    };
    return Loan;
};
