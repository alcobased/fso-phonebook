const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

morgan.token('content', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(express.static('build'))


persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": 2,
    "name": "Barbara Lumen",
    "number": "543-6023402",
  },
  {
    "id": 3,
    "name": "Clive Owen",
    "number": "550-554333",
  },
  {
    "id": 4,
    "name": "Daria Roberts",
    "number": "113-6445435",
  },
]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
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

getId = () => {
  const id = Math.floor(Math.random() * 1000)
  return persons.find(person => person.id === id) ? getId() : id
}

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({error: 'name missing'})
  }
  if (!req.body.number) {
    return res.status(400).json({error: 'number missing'})
  }
  if (persons.find(person => person.name === req.body.name)) {
    return res.status(400).json({error: `${req.body.name} is already in phonebook`})
  }

  const person = {
    id: getId(),
    name: req.body.name,
    number: req.body.number,
  }
  
  persons = persons.concat(person)
  
  res.json(person)
  
})


app.listen(3001)