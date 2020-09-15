const express = require('express');
const app = express();
app.use(express.json());

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

const generateId = () => {
    const min = Math.floor(100000);
    const max = Math.floor(500000);
    return Math.floor(Math.random() * (max - min)) + min;
};

app.get('/', (_, res) => {
    res.send(
        '<h1>View Phonebook persons <a href="http://localhost:3001/api/persons">here</a></h1>'
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

app.post('/api/persons', (req, res) => {
    const { body } = req;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }

    if (persons.find((e) => body.name === e.name)) {
        return res.status(409).json({ error: 'name must be unique' });
    }

    persons = persons.concat({
        name: body.name,
        number: body.number,
        id: generateId(),
    });

    res.json(person);
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