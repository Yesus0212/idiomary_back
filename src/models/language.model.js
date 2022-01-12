const mongoose = require ('mongoose')

const languageSchema = new mongoose.Schema(
    {
        language: String,
        countries: {
            type: Map,
            of: [String],
        }
    }
);

const language = mongoose.model('language', languageSchema)

module.exports = language;