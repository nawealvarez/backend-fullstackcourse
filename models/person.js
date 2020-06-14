const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set("useFindAndModify", false);
mongoose.set('useCreateIndex', true);
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("connected to MongoDB");
    })
    .catch(err => {
        console.log("connection error: ", err.message);
    });

    const personSchema = new mongoose.Schema({
        name: {type: String, minlength: [3, 'Name must be at least 3 characters'], required: true, unique: [true, 'A name is required']},
        number: {type: String, minlength: [8, 'Number must be at least 8 characters'], required: [true, 'A number is required']},
    })

    personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString();
            delete returnedObject._id;
            delete returnedObject.__v;
        }
    });

    personSchema.plugin(uniqueValidator);

    module.exports = mongoose.model('Person', personSchema);
