const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPswd = sequelize.define('ForgotPswdReq', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    isActive: Sequelize.BOOLEAN
});

module.exports = ForgotPswd;