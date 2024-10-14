const mongoose = require('mongoose')

if (process.argv.length<3){
  console.log('provide password and details')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://adegokephilip001:${password}@phonebook.e9b1p.mongodb.net/`
const name = process.argv[3]
const number = process.argv[4]


mongoose.set('strictQuery', false)

// Conects to the data base
mongoose.connect(url).then(() => {
  console.log('conected to DB')


  //Creates the blueprint
  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)



  // cheaks if oly password is 0n the command line
  if (process.argv.length === 3) {
    Person.find({}).then(result => {
      console.log('Phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    }).catch(err => {
      console.log('unable fetch because', err.message)
      mongoose.connection.close()
    })
  }


  //cheaks if password and name is added to the command
  else if(process.argv.length > 3){
    const person = new Person({
      name: name,
      number: number
    })

    person.save().then(result => {
      console.log(`Added ${name} number ${number} to the phonebook`)
      mongoose.connection.close()
    }).catch(err => {
      console.error('Error saving person:', err.message)
      mongoose.connection.close()
    })
  }
}).catch(err => {
  console.error('unable to connect:', err.message)
})



