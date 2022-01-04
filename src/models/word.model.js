const mongoose = require ('mongoose')

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        minlegth: 2,
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
    addLanguages:{
        type: Map,
        required: true,  
        // id: {
        //     type: mongoose.Types.ObjectId,
        //     required: true,
        // },
        // language: {
        //     type: String,
        //     minlegth: 2,
        //     maxlegth: 25,
        //     required: true,
        // },
        // meaning: {
        //     type: String,
        //     required: true,
        // },
        // status: {
        //     type: Number,
        //     required: true,
        // },
        // reason: {
        //     type: String,
        //     required: true,
        // },    
    },
    createdAt:{
        type: Date,
        required: true,
    },
    likes: {
        type: Number,
        min: 0,
        required: true,
    },
    reason: {
        type: String,
        minlength: 2,
        required: true,
    },
    status: {
        type: Number,
        min: 0,
        required: true,
    },
    complements:{
        type: Map,
        required: true,  
        // id: {
        //     type: mongoose.Types.ObjectId,
        //     required: true,
        // },
        // meaning: {
        //     type: String,
        //     required: true,
        // },
        // example: {
        //     type: String,
        //     required: false,
        // },
        // urlImage: {
        //     type: String,
        //     required: false,
        // },
        // language: {
        //     type: String,
        //     minlegth: 2,
        //     maxlegth: 25,
        //     required: true,
        // },
        // country: {
        //     type: String,
        //     minlegth: 2,
        //     maxlegth: 50,
        //     required: true,
        // },
        // state: {
        //     type: String,        
        //     minlegth: 2,
        //     maxlegth: 50,
        //     required: true,
        // },
        // topic: {
        //     type: String,
        //     required: true,
        // },  
        // addLanguages:{
        //     type: Map,
        //     of: Map,
        //     required: true,  
        //     id: {
        //         type: mongoose.Types.ObjectId,
        //         required: true,
        //     },
        //     language: {
        //         type: String,
        //         minlegth: 2,
        //         maxlegth: 25,
        //         required: true,
        //     },
        //     meaning: {
        //         type: String,
        //         required: true,
        //     },
        //     status: {
        //         type: Number,
        //         required: true,
        //     },
        //     reason: {
        //         type: String,
        //         required: true,
        //     },    
        // },  
        // createdAt:{
        //     type: Date,
        //     required: true,
        // },
        // likes: {
        //     type: Number,
        //     min: 0,
        //     required: true,
        // },
        // reason: {
        //     type: String,
        //     minlength: 2,
        //     required: true,
        // },
        // status: {
        //     type: Number,
        //     min: 0,
        //     required: true,
        // },
    },
});

const Word = mongoose.model('word', wordSchema)

module.exports = Word;