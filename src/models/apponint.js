const sequelize = require('./index')
const { Sequelize, Model, DataTypes } = require("sequelize");

const appointment = sequelize.define("app", {
    id: DataTypes.INT,
    clientName: DataTypes.TEXT,
    time: DataTypes.TIME,
    date: DataTypes.DATE,
    optionalDesc: DataTypes.TEXT
})

module.exports = appointment;