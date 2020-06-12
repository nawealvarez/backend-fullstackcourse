const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fullstack-1l6fw.mongodb.net/phonebook-app?retryWrites=true&w=majority`
 mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

 const personSchema = mongoose.Schema({
     name: String,
     number: String
 });

 const Person = mongoose.model('Person', personSchema);


 const person = new Person({
     name: process.argv[3],
     number: process.argv[4]
 });

 person.save().then(result =>{
     console.log(`${person.name} saved successfully!\n`)
     console.log('phonebook:\n')
     Person.find({}).then(result =>{
        result.forEach(person =>{
            console.log(`${person.name} ${person.number}\n`)
        })
     mongoose.connection.close()
 })
});