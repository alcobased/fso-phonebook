require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
app.use(express.json())

morgan.token('content', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.static('build'))


let persons = []

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  res.send(`
  <p>Phonebook has info for ${Person.estimatedDocumentCount()} people</p>
  <p>${new Date}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT)