const express = require('express')
const app = express()
require('dotenv').config()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


morgan.token('data', function (req, res, data) {
    return req.body[data];
});

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {name::data[name], number::data[number]}'))
app.use(express.json())
app.use(express.static('build'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-55555"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-42-23324234"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-234234"
    }
]

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has entries for ${persons.length} persons <br> ${new Date()}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
    //res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons/', (request, response) => {
    const contact = request.body
    let personsNames = persons.map((person) => person.name)

    if (!contact.name || !contact.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    if (personsNames.includes(contact.name)) {
        return response.status(400).json({
            error: 'Contact already in phonebook'
        })
    }

    const person = {
        id: generateId(),
        name: contact.name,
        number: contact.number
    }
    persons = persons.concat(person)
    response.json(person)

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})