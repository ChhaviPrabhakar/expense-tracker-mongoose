const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', '722446', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;