const mongoose = require ('mongoose')

const languageSchema = new mongoose.Schema(
    { 
        language: {
            type: String,
            minlegth: 2,
            maxlegth: 25,
            required: true,
        },
        countries:
        [
            {
                country: {
                    type: String,
                    minlegth: 2,
                    maxlegth: 50,
                    required: true,
                },
                states: {
                    type: Array,
                    of: String, 
                },        
            }
        ],
    }
);

const language = mongoose.model('language', languageSchema)

module.exports = language;