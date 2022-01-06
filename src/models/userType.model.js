const mongoose = require ('mongoose')

const userTypeSchema = new mongoose.Schema({        
    userType: {
        type: String,
        required: true,
    },
    pointsToBe: {
        type: Number,
        min: 1, 
        required: true,
    },    
});

const UserType = mongoose.model('userType', userTypeSchema)

module.exports = UserType;