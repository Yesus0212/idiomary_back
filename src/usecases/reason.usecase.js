const Reason = require('../models/reason.model');

// Función de consulta de todos los Reason y filtrado
async function getReasons(filters) {
    const reasons = await Reason.find(filters);
    return reasons;
}


// Función de consulta por ID
async function getReasonsById(request) {
    const id = request;
    const reason = await Reason.findById(id);
    return reason;
}


// Función de inserción de reason nuevo
async function setReason(request) {
    const {reason} = request;    
    const setReason = await Reason.create({
        reason,
    });
    return setReason;
}

// Función de eliminación de reason por ID
async function deleteReason(request) {
    const id = request;         
    const deleteReason = await Reason.findByIdAndDelete(id);
    return deleteReason;
}

module.exports = {
    getReasons,
    getReasonsById,
    setReason,
    deleteReason,
};