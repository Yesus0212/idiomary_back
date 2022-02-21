const mongoose = require ('mongoose')

const filterSchema = new mongoose.Schema(
    {
        language: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        topic: {
            type: String,
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
    likes: {
        type: Array,
        required: false,
    }
});

const User = mongoose.model('user', userSchema)

module.exports = User;