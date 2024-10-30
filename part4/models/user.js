const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    PasswordHash: String,
    blog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.PasswordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User