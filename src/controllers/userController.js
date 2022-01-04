const User = require('../models/user')

const createUser = async (username, password ) => {
    await User.create({ username: username, password: password })
}

const findUser = async (username) => {
    return await User.findOne({
        where: {
            username: username
        }
    })
}

const findAllUsers = async () => {
    return await User.findAll();
}

module.exports = { createUser, findUser, findAllUsers }