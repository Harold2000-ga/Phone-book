const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
const connection = async () => {
    try {
        await mongoose.connect(url)
        console.log('Connected to database')
    } catch (error) {
        console.log(error)
        throw new Error('No connection to database')
    }
}

module.exports = connection
