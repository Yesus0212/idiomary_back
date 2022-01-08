const mongoose = require ('mongoose')

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        minlegth: 2,
        required: true,
    },
    type: {
        type: String,
        minlegth: 2,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    meaning: {
        type: String,
        required: true,
    },
    example: {
        type: String,
        required: false,
    },
    urlImage: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        minlegth: 2,
        maxlegth: 25,
        required: true,
    },
    country: {
        type: String,
        minlegth: 2,
        maxlegth: 50,
        required: true,
    },
    state: {
        type: String,        
        minlegth: 2,
        maxlegth: 50,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    translations:[{
        userName: {
            type: String,
            required: false,
        },
        language: {
            type: String,
            minlegth: 2,
            maxlegth: 25,
            required: false,
        },
        meaning: {
            type: String,
            required: false,
        },
        userValidator: {
            type: String,
            required: false,
        },
        status: {
            type: Number,
            required: false,
        },
        reason: {
            type: String,
            required: false,
        },    
    }],
    createdAt:{
        type: Date,
        default: Date.now,
        required: true,
    },
    likes: {
        type: Number,
        min: 0,
        required: true,
    },
    userValidator: {
        type: String,
        required: false,
    },
    status: {
        type: Number,
        min: 0,
        required: true,
    },
    reason: {
        type: String,
        minlength: 2,
        required: false,
    },    
    complements:[{
        userName: {
            type: String,
            required: false,
        },
        meaning: {
            type: String,
            required: false,
        },
        example: {
            type: String,
            required: false,
        },
        urlImage: {
            type: String,
            required: false,
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
        topic: {
            type: String,
            required: false,
        },  
        translations:[{
            userName: {
                type: String,
                required: false,
            },
            language: {
                type: String,
                minlegth: 2,
                maxlegth: 25,
                required: false,
            },
            meaning: {
                type: String,
                required: false,
            },
            userValidator: {
                type: String,
                required: false,
            },
            status: {
                type: Number,
                required: false,
            },
            reason: {
                type: String,
                required: false,
            },                
        }],  
        createdAt:{
            type: Date,
            default: Date.now,
            required: false,
        },
        likes: {
            type: Number,
            min: 0,
            required: false,
        },
        userValidator: {
            type: String,
            required: false,
        },
        reason: {
            type: String,
            minlength: 2,
            required: false,
        },
        status: {
            type: Number,
            min: 0,
            required: false,
        },
    }],
});

const Word = mongoose.model('word', wordSchema)

module.exports = Word;