const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password>'
    )
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://Haroldga:${password}@cluster0.a1jriff.mongodb.net/phone-book?retryWrites=true&w=majority`
mongoose.connect(url)
if (process.argv.length === 3) {
    Contact.find({}).then(contact => {
        console.log('Phone-Book:\n')
        contact.map(item => {
            console.log(`${item.name} ${item.number}`)
        })
        mongoose.connection.close()
    })
}
if (process.argv.length === 5) {
    const userName = process.argv[3]
    const userNumber = process.argv[4]
    const contact = new Contact({
        name: userName,
        number: userNumber,
    })

    contact.save().then(result => {
        console.log('Contact saved!')
        mongoose.connection.close()
    })
}
