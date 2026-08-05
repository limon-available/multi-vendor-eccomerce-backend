const mongoose = require("mongoose")
const { isProduction, mongoUrl } = require('../config/env')
const logger = require('./logger')

// Fail fast on bad queries instead of buffering them forever when the
// connection is down — surfaces problems as errors the controllers can return.
mongoose.set('strictQuery', true)

mongoose.connection.on('connected', () => {
    logger.info(`${isProduction ? 'production' : 'local'} database connected`)
})

mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', error.message)
})

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected')
})

module.exports.dbConnect = async () => {
    if (!mongoUrl) {
        throw new Error('MongoDB connection string is not configured')
    }

    await mongoose.connect(mongoUrl, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    })
}
