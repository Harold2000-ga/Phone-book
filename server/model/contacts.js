const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject._id
    },
})

module.exports = mongoose.model('Contact', contactSchema, 'contacts')
