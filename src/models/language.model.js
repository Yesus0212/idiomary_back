const mongoose = require ('mongoose')

const languageSchema = new mongoose.Schema({    
    language: {
        type: String,
        minlegth: 2,
        maxlegth: 25,
        required: true,
    },
    countries:[{
        id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        country: {
            type: String,
            minlegth: 2,
            maxlegth: 50,
            required: true,
        },
        states: {
            state: {
                type: String,        
                minlegth: 2,
                maxlegth: 50,
                required: true,
            },
        },        
    }],
});

const language = mongoose.model('language', languageSchema)

module.exports = language;