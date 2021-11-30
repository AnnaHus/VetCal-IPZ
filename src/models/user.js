const sequelize = require('./index')
const { Sequelize, Model, DataTypes } = require("sequelize");

const user = sequelize.define("app", {
    id: DataTypes.INT,
    username: DataTypes.TEXT,
    password: DataTypes.TEXT
})

module.exports = user;