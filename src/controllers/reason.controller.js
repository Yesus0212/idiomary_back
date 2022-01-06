const Reason = require('../usecases/reason.usecase');

async function getReason(request, response) {
    try {
        const {reason} = request.query;               
        const {type} = request.query;
        const filters = {};
    
        if(reason) filters.reason = { $regex: reason };
        if(type) filters.type = { $regex: type };

        const reasons = await Reason.getReasons(filters);

        response.statusCode = 200;
        response.json({
            reasons
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Reasons',
            error
        });
    }
};

async function getReasonById(request, response) {
    try {
        const id = request.params.id;
        
        const reasons = await Reason.getReasonsById(id);

        response.statusCode = 200;
        response.json({
            reasons
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Reason',
            error
        });
    }
};


async function setReason(request, response) {
    try {
        const newReason = request.body;
        const createReason = await Reason.setReason(newReason);

        response.statusCode = 200;
        response.json({
            success: true,
            newReason
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not set new Reason',
            error
        });
    }
};


async function deleteReason(request, response) {
    try {
        const id = request.params.id;

        const deleteReason = await Reason.deleteReason(id);

        response.statusCode = 200;
        response.json({
            success: true,
            deleteReason
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not delete a Reason',
            error
        });
    }
};


module.exports = {
    getReason,
    getReasonById,
    setReason,
    deleteReason,
};