const sequelize = require('./index')
const { Sequelize, Model, DataTypes } = require("sequelize");

const App = sequelize.define("app", {
    name: DataTypes.TEXT,
    petName: DataTypes.TEXT,
    petSpec: DataTypes.TEXT,
    time: DataTypes.TEXT
})


module.exports = App