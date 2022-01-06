const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        minlegth: 2,
        required: true,
    },
    email: {
        type: String,
        minlegth: 2,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        minlegth: 2,
        maxlegth: 25,
        required: false,
    },
    country: {
        type: String,
        minlegth: 2,
        maxlegth: 50,
        required: false,
    },
    state: {
        type: String,        
        minlegth: 2,
        maxlegth: 50,
        required: false,
    },
    urlImage: {
        type: String,
        required: false,
    },    
    userType: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        min: 1, 
        required: true,
    },
    filters:[{
        id: {
            type: mongoose.Types.ObjectId,
            required: false,
        },
        language: {
            type: String,
            minlegth: 2,
            maxlegth: 25,
            required: false,
        },
        countries:[{
            id: {
                type: mongoose.Types.ObjectId,
                required: false,
            },
            country: {
                type: String,
                minlegth: 2,
                maxlegth: 50,
                required: false,
            },
            states: {
                type: Map,
                of: String,
                required: false
            },
            topic: {
                type: String,
                required: false,
            },
        }],
    }],
});

const User = mongoose.model('user', userSchema)

module.exports = User;