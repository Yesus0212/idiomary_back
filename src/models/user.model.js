const mongoose = require ('mongoose')

const filterSchema = new mongoose.Schema(
    {
        languages: {
            type: Array,
            of: String,
            required: false,
        },
        countries: {
            type: Array,
            of: String,
            required: false,
        },
        states: {
            type: Array,
            of: String,
            required: false,
        },
        topics: {
            type: Array,
            of: String,
            required: false,
        },        
    }
);

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        minlegth: 2,
        required: true,
    },
    email: {
        type: String,
        minlegth: 2,
        unique: true,
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
        required: false,
    },
    inValidation: {
        type: Number,
        min: 0,
        required: false,
    },
    validated: {
        type: Number,
        min: 0,
        required: false,
    },
    canceled: {
        type: Number,
        min: 0,
        required: false,
    },
    filters: filterSchema,
});

const User = mongoose.model('user', userSchema)

module.exports = User;