const sequelize = require('./index')
const { Sequelize, Model, DataTypes } = require("sequelize");

const appointment = sequelize.define("Appointment", {
    clientName: DataTypes.TEXT,
    time: DataTypes.TIME,
    date: DataTypes.DATEONLY,
    duration: DataTypes.INTEGER,
    optionalDesc: DataTypes.TEXT
})

module.exports = appointment;