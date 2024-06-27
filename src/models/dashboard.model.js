const jwt = require('jsonwebtoken');

module.exports = (sequelize, Sequelize) => {
    const Dashboardauth = sequelize.define("Dashboardauth", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isBlocked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    });

    // Users.prototype.getJWTToken = function () {
    //     return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
    //         expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
    //     });
    // };

    // Users.prototype.getJWTRefreshToken = function () {
    //     return jwt.sign({ id: this.id }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
    //         expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
    //     });
    // };

    return Dashboardauth;
};
