const mongoose = require('mongoose')

const password = process.argv[2]
const nameInput = process.argv[3]
const numberInput = process.argv[4]

const url =
    `mongodb+srv://DB_User_14:${password}@cluster0.jpoj8.mongodb.net/people?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', contactSchema)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else if (process.argv.length === 3) {
    console.log('Phonebook')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {    

    const person = new Person({
        name: `${nameInput}`,
        number: `${numberInput}`,
    })

    person.save().then(result => {
        console.log(`Added ${nameInput} number ${numberInput} to phonebook`)
        mongoose.connection.close()
    })
}