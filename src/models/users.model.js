const jwt = require('jsonwebtoken');
const { types } = require('pg');

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        phone: {
            type: Sequelize.BIGINT,
            validate: {
                isNumeric: true,
                len: [7, 15] // Assuming phone numbers are between 7 and 15 digits long
            },
            allowNull: false
        },
        country_code: {
            type: Sequelize.INTEGER,
            validate: {
                isNumeric: true,
                len: [1, 5] // Assuming country codes are between 1 and 5 digits long
            },
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dob: {
            type: Sequelize.DATE,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM('login', 'logout'),
            allowNull: false,
            defaultValue: 'logout'
        },
        isBlocked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        indexes: [
            {
                unique: true,
                fields: ['phone', 'country_code'] // Assuming phone and country code combination should be unique
            }
        ]
    });

    Users.prototype.getJWTToken = function () {
        return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
        });
    };

    Users.prototype.getJWTRefreshToken = function () {
        return jwt.sign({ id: this.id }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
        });
    };

    return Users;
};
