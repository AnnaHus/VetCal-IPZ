const sequelize = require('./index')
const { Sequelize, Model, DataTypes } = require("sequelize");

const user = sequelize.define("user", {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT
})

module.exports = user;