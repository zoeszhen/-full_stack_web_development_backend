const express = require('express');
const app = express();

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/', (_, res) => {
  res.send(
    '<h1>View Phonebook persons here: <a href="http://localhost:3001/api/persons">http://localhost:3001/api/persons</a></h1>'
  );
});

app.get('/info', (_, res) => {
  const receiveTime = new Date();
  res.send(
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${receiveTime}</p>
    </div>`
  );
});

app.get('/api/persons', (_, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons.find((e) => e.id === id) ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((e) => e.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});