const App = require('../models/apponint')

const createApp = async (name, petName, petSpec, time ) => {
    await App.create({ name: name, petName: petName, petSpec:petSpec, time:time })
}

const findApps = async () => {
    return await App.findAll()
}

module.exports = { createApp, findApps }