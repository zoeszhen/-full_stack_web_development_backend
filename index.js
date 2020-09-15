const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json())
    .use(cors())
    .use(express.static('build'));

morgan.token('body', (req) => {
    const body = req.body;
    return JSON.stringify(body);
});

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

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
        `<h1>View Phonebook persons <a href="http://localhost:${PORT}/api/persons">here</a></h1>`
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});