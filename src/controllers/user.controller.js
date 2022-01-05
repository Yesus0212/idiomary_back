const User = require('../usecases/user.usecase');

async function getUser(request, response) {
    try {
        const {userName} = request.query;               
        const filters = {};
    
        if(userName) filters.userName = { $regex: userName };        

        const users = await User.getUsers(filters);

        response.statusCode = 200;
        response.json({
            users
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Users',
            error
        });
    }
};

async function getUserById(request, response) {
    try {
        const id = request.params.id;
        
        const users = await User.getUsersById(id);

        response.statusCode = 200;
        response.json({
            users
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get User',
            error
        });
    }
};


async function setUser(request, response) {
    try {
        const newUser = request.body;
        const createUser = await User.setUser(newUser);

        response.statusCode = 200;
        response.json({
            success: true,
            newUser
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not set new User',
            error
        });
    }
};


async function deleteUser(request, response) {
    try {
        const id = request.params.id;

        const deleteUser = await User.deleteUser(id);

        response.statusCode = 200;
        response.json({
            success: true,
            deleteUser
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not delete a User',
            error
        });
    }
};


module.exports = {
    getUser,
    getUserById,
    setUser,
    deleteUser,
};