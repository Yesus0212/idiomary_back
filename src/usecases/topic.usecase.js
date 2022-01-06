const Topic = require('../models/topic.model');

// Función de consulta de todos los Post y filtrado
async function getTopics(filters) {
    const topics = await Topic.find(filters);
    return topics;
}


// Función de consulta por ID
async function getTopicsById(request) {
    const id = request;
    const topic = await Topic.findById(id);
    return topic;
}


// Función de inserción de topic nuevo
async function setTopic(request) {
    const {topic} = request;    
    const setTopic = await Topic.create({
        topic,
    });
    return setTopic;
}

// Función de eliminación de topic por ID
async function deleteTopic(request) {
    const id = request;         
    const deleteTopic = await Topic.findByIdAndDelete(id);
    return deleteTopic;
}

module.exports = {
    getTopics,
    getTopicsById,
    setTopic,
    deleteTopic,
};