const UserType = require('../usecases/userType.usecase');

async function getUserType(request, response) {
    try {
        const {userType} = request.query;               
        const {pointsToBe} = request.query;
        const filters = {};
    
        if(userType) filters.userType = { $regex: userType };
        if(pointsToBe) filters.pointsToBe =  pointsToBe ;

        const userTypes = await UserType.getUserTypes(filters);

        response.statusCode = 200;
        response.json({
            userTypes
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get UserTypes',
            error
        });
    }
};

async function getUserTypeById(request, response) {
    try {
        const id = request.params.id;
        
        const userTypes = await UserType.getUserTypesById(id);

        response.statusCode = 200;
        response.json({
            userTypes
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get UserType',
            error
        });
    }
};


async function setUserType(request, response) {
    try {
        const newUserType = request.body;
        const createUserType = await UserType.setUserType(newUserType);

        response.statusCode = 200;
        response.json({
            success: true,
            newUserType
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not set new UserType',
            error
        });
    }
};


async function deleteUserType(request, response) {
    try {
        const id = request.params.id;

        const deleteUserType = await UserType.deleteUserType(id);

        response.statusCode = 200;
        response.json({
            success: true,
            deleteUserType
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not delete a UserType',
            error
        });
    }
};


module.exports = {
    getUserType,
    getUserTypeById,
    setUserType,
    deleteUserType,
};