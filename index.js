const express = require('express');
const app = express();
require('dotenv').config(path: __dirname + '/.env');
const Person = require('./models/person');
const morgan = require('morgan');

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons =>{
        res.json(persons.map(person => person.toJSON()));
    });
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    console.log(body.name, body.number);

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON());
        console.log('Person added successfully!')
    }).catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(person => {
        res.status(204).end();
    }).catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => next(error));
});

app.get('/info', (req, res)=>{
    Person.count({}).then(length => {
        res.send(
            `<p>Phonebook has info for ${length} people </p>
            <p> ${new Date()} </p>`
        );
    });
});

const morganMW = morgan.token('content', req =>{
    console.log(req.body);
    if (!req.body){
        return "";
    }
    return JSON.stringify(req.body);
});

app.use(morganMW(
    ":method :url :status :res[content-length] - :response-time ms :content"
));

const unknownEndpoint = (req, res) => {
    res.status(404).send({errir: 'unknown endpoint'});
}

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === "castError" && error.kind === "ObjectId") {
        return res.status(400).send({error: error.message});
    }
    next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server runnnig on port ${PORT}`);
});