const sequelize = require('./index')
const { Sequelize, Model, DataTypes } = require("sequelize");

const appointment = sequelize.define("Appointment", {
    clientName: DataTypes.TEXT,
    dateTime: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    optionalDesc: DataTypes.TEXT,
    allDay: DataTypes.BOOLEAN
})

module.exports = appointment;