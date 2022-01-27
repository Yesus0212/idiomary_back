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
        let result;

        if(error.code === 11000){
            response.statusCode = 412;
            result = {
                "error": "1100",
                "value": "Correo o usuario duplicados"
            }
        }
        else{
            response.statusCode = 500;
            result = error;
        }

        response.json({
            success: false,
            message: 'Could not set new User',
            result
        });
    }
};

// Función para actualizar las palabras de un usuario, una vez que la palabra es creada, validada o cancelada
async function updateNumberWords(request, response) {
    try {
        const {idUser, statusWord} = request;
        const updateNumbers = await User.updateNumber({idUser, statusWord});

        response.statusCode = 200;
        response.json({
            success: true,
            updateNumbers
        })

    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not update a Word',
            error
        });
    }
}

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
    updateNumberWords,
    deleteUser,
};