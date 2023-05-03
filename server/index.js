const express = require('express')
const cors = require('cors')
const path = require('path')
var morgan = require('morgan')

const app = express()

const PORT = process.env.PORT || 3001

let contact = [
    {
        id: 1,
        name: 'Harold',
        number: '+5354382930',
    },
    {
        id: 2,
        name: 'Liana',
        number: '+5354327507',
    },
    {
        id: 3,
        name: 'Yoxi',
        number: '+5352442313',
    },
]
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
/* Home  */
app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
})
/* All persons */
app.get('/api/persons', (req, res) => {
    res.status(200).json(contact)
})
/* Info */
app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
        `<p>Phone-book has info for ${contact.length} people</p><p>${date}</p>`
    )
})
/* Get person */
app.get('/api/persons/:id', (req, res) => {
    let id = parseInt(req.params.id)
    const person = contact.find(item => item.id == id)
    person
        ? res.send(person)
        : res.status(404).send({ error: 'Person not found' })
})
/* Delete person */
app.delete('/api/persons/:id', (req, res) => {
    let id = parseInt(req.params.id)
    contact = contact.filter(item => item.id !== id)

    res.status(204).end()
})
const getId = () => {
    /* Post person */
    let maxId = 0
    contact.length > 0
        ? (maxId = Math.max(...contact.map(item => item.id)) + 1)
        : (maxId.id = 0)
    return maxId
}
app.post('/api/persons/', (req, res) => {
    let user = req.body
    if (user.name === '') {
        res.status(400).json({
            status: 'Error',
            message: 'The name cannot be empty',
        })
    }
    const filterName = contact.find(item => item.name === user.name)
    if (!filterName) {
        user.id = getId()
        contact = [...contact, user]
        res.status(200).json({
            status: 'Success',
            message: 'Has been post',
            contact,
        })
    }
    res.status(422).json({
        status: 'Error',
        message: 'The name must be unique',
    })
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
