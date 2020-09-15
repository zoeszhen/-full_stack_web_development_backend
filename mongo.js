const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password>'
    );
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster0.7xg2i.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

const personName = process.argv[3];
const personNumber = process.argv[4];

const person = new Person({
    name: personName,
    number: personNumber,
});

personName && personNumber
    ? person.save().then((result) => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    })
    : Person.find({}).then((result) => {
        console.log('phonebook:');
        result.forEach((person) =>
            console.log(`${person.name} ${person.number}`)
        );
        mongoose.connection.close();
    });