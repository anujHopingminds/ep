// prescription.model.js
module.exports = (sequelize, Sequelize) => {
    const Prescription = sequelize.define("prescription", {
        userID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        imagesPath: {
            type: Sequelize.JSON,
            allowNull: false
        }
    });

    return Prescription;
};
