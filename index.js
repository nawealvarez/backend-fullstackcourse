const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.static("build"));
app.use(express.json());

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

const generateId = () =>{
    const maxId = persons.length > 0 
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId +1;
};

app.get('/', (req, res) => {
    res.send('<h1>Welcome to API from the Phonebook</h1>');
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if(person){
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'Name and Number are required'
        });
    } if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({ error: 'Name must be unique'});
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        };
    
        persons = persons.concat(person);
        res.json(person);
        console.log('Person added successfully!');
    }
    

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    res.status(204).end();
})

app.get('/info', (req, res)=>{
    const people = generateId() - 1;
    const dateToday = new Date();

    res.send(`Phonebook has info for ${people} people <br/> ${dateToday}`);
})




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server runnnig on port ${PORT}`);
})

let persons = [
    {
        name: "Arto Hellas",
        number: "15698",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
];
