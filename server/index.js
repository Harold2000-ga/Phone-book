const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const path = require('path')
const connection = require('./database/connection')
var morgan = require('morgan')

//Model import
const Contact = require('./model/contacts')
//Create server
const app = express()
const PORT = process.env.PORT || 3001

//Connection to database
connection()

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
/* Home  */
app.get('/', (req, res) => {
    return res.send('<h1>Hello</h1>')
})
//List all persons
app.get('/api/persons', (req, res) => {
    Contact.find({})
        .sort({ createdAT: -1 })
        .then(contact => {
            res.status(200).json(contact)
        })
})
//Get person
app.get('/api/persons/:id', (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
    Contact.findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).send({
                    status: 'Error',
                    message: 'Person no found',
                })
            }
            return res.status(200).send({
                status: 'Success',
                person,
            })
        })
        .catch(error => {
            return res.status(400).send({
                status: 'Error',
                message: 'Bad request',
            })
        })
})
//Delete person
app.delete('/api/persons/:id', (req, res) => {
    let id = req.params.id
    Contact.findByIdAndDelete(id)
        .then(response => {
            return res.status(204).send({
                status: 'Success',
                response,
            })
        })
        .catch(error => {
            return res.status(404).send({
                status: 'Error',
                message: 'Error in find',
            })
        })
})
//Post person to list
app.post('/api/persons/', (req, res) => {
    //Get body params
    let params = req.body
    //Validate if is not empty
    if (params.name === '' || params.number === '') {
        return res.status(400).json({
            status: 'Error',
            message: 'The name or number cannot be empty',
        })
    }
    //Validate if is unique
    Contact.find({ name: params.name }).then(users => {
        if (users.length > 0) {
            return res.status(422).json({
                status: 'Error',
                message: 'The name must be unique',
            })
        }
        //Create user to save
        const newUser = new Contact({
            name: params.name,
            number: params.number,
        })
        //Save user
        newUser.save().then(() => {
            return res.status(200).json({
                status: 'Success',
                message: 'User add',
                user: newUser,
            })
        })
    })
})
//Update person
app.put('/api/persons/:id', (req, res) => {
    //Get id and new data
    const id = req.params.id
    const newContact = req.body
    //Validate data
    if (newContact.name === '' || newContact.number === '') {
        return res.status(400).send({
            status: 'Error',
            message: 'The data cannot be empty',
        })
    }
    //Search in database by duplicate
    Contact.find({ name: newContact.name }).then(contacts => {
        if (contacts.length > 0) {
            return res.status(400).send({
                status: 'Error',
                message: 'The name must be unique',
            })
        }
        //Update
        Contact.findByIdAndUpdate(id, newContact, { new: true })
            .then(Updated => {
                return res.status(200).send({
                    status: 'Success',
                    Updated,
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(400).send({
                    status: 'Error',
                    message: 'Error in find',
                })
            })
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
