const App = require('../models/apponint')

const createApp = async (clientName, time, date, duration, optionalDesc ) => {
    await App.create({ clientName: clientName, time: time, date:date, duration: duration, optionalDesc:optionalDesc })
}

const findAllApps = async () => {
    return await App.findAll()
}

const findApps = async (date) => {
    console.log(date)
    return await App.findAll({
        where: {
            date: date
        }
    })
}

module.exports = { createApp, findAllApps, findApps }