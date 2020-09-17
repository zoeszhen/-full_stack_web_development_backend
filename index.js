require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');
const PORT = process.env.PORT || 3001;
const baseURL = process.env.baseURL || "http://localhost";

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
    const body = req.body;
    return JSON.stringify(body);
});

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (_, res) => {
    res.send(
        `<h1>View Phonebook persons <a href="${baseURL}:${PORT}/api/persons">here</a></h1>`
    );
});

app.get('/info', async (req, res) => {
    const getPerson = () => Person.find({}).then((e) => e.length);
    const receiveTime = new Date();
    getPerson
        .then(() => {
            res.send(
                `<div>
                    <p>Phonebook has info for ${personsQty} people</p>
                    <p>${receiveTime}</p>
                </div>`)
        })
        .catch((error) => {
            console.log(error);
        })
});

app.get('/api/persons', (_, res) => {
    Person.find({}).then((person) => res.json(person));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => {
            person ? res.json(person) : res.status(404).end();
        })
        .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    Person.findOneAndUpdate(
        { _id: body.id },
        {
            name: body.name,
            number: body.number,
        },
        {
            new: true,
            runValidators: true,
            context: 'query',
        }
    )
        .then((updatedPerson) =>
            updatedPerson
                ? res.json(updatedPerson)
                : res.status(404).send({
                    error: `Contact of ${body.name} does not exist, perhaps already been removed from server.`,
                })
        )
        .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => savedPerson.toJSON())
        .then((savedAndFormattedNote) => res.json(savedAndFormattedNote))
        .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch((error) => next(error));
});

// handler of requests with unknown endpoint
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    if (
        Object.entries(error.errors).some(([key, value]) => value.kind === 'unique')
    ) {
        return res.status(409).json({ error: error.message });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    next(error);
};
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});