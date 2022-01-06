const mongoose = require ('mongoose')

const reasonSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
});

const Reason = mongoose.model('reason', reasonSchema)

module.exports = Reason;