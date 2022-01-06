const Topic = require('../usecases/topic.usecase');

async function getTopic(request, response) {
    try {
        const {topic} = request.query;               
        const filters = {};
    
        if(topic) filters.meaning = { $regex: meaning };        

        const topics = await Topic.getTopics(filters);

        response.statusCode = 200;
        response.json({
            topics
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Topics',
            error
        });
    }
};

async function getTopicById(request, response) {
    try {
        const id = request.params.id;
        
        const topics = await Topic.getTopicsById(id);

        response.statusCode = 200;
        response.json({
            topics
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Topic',
            error
        });
    }
};


async function setTopic(request, response) {
    try {
        const newTopic = request.body;
        const createTopic = await Topic.setTopic(newTopic);

        response.statusCode = 200;
        response.json({
            success: true,
            newTopic
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not set new Topic',
            error
        });
    }
};


async function deleteTopic(request, response) {
    try {
        const id = request.params.id;

        const deleteTopic = await Topic.deleteTopic(id);

        response.statusCode = 200;
        response.json({
            success: true,
            deleteTopic
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not delete a Topic',
            error
        });
    }
};


module.exports = {
    getTopic,
    getTopicById,
    setTopic,
    deleteTopic,
};