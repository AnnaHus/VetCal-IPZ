const App = require('../models/appointment')
const { Op } = require("sequelize");

const createApp = async (clientName, dateTime, duration, optionalDesc, allDay ) => {
    return await App.create({ clientName: clientName, dateTime: dateTime, duration: duration, optionalDesc:optionalDesc, allDay: allDay })
}

const findAllApps = async () => {
    return await App.findAll()
}

const findApps = async (start, end) => {
    return await App.findAll({
        where: {
            dateTime: {
                [Op.and]: {
                    [Op.gte]: start,
                    [Op.lt]: end
                  }
            }
        }
    })
}

module.exports = { createApp, findAllApps, findApps }