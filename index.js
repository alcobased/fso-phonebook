const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
app.use(express.json())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  console.log('api call for all persons')
  Person.find({}).then(persons => {
    res.json(persons)
  })
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

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
})

app.get('/api/persons/:id', (req,res) => {
  console.log(`api call to find by id: ${req.params.id}`)
  Person.findById(req.params.id)
    .then(result => {
      res.json(result)
    })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`listening on port ${PORT}`)