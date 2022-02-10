const User = require('../usecases/user.usecase');
const S3 = require('../Utils/s3saveImage');

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
        const {userName, email, password, language, country, state, fileImage, userType, points, filters} = request.body;

        const urlImage = await S3.saveImage(fileImage);

        const result = await User.setUser({userName, email, password, language, country, state, urlImage, userType, points, filters});

        response.statusCode = 201;
        response.json({
            success: true,
            result
        })

        
    }
    catch(error) {        
        let result;

        if(error.code === 11000){
            response.statusCode = 412;
            result = {
                "error": "11000",
                "value": "Correo o usuario duplicados"
            }
        }
        else{
            response.statusCode = 400;
            result = error;
        }

        response.json({
            success: false,
            message: 'Could not set new User',
            result
        });
    }
};


async function getLogin(request, response) {
    try {
        const {email, password} = request.body;

        const token = await User.getLogin({email, password});

        if(token.error === 401){
            response.statusCode = 401;
            response.json({
                success: false,
                message: "¡Correo o contraseña incorrectos, veríficalo!"
            });
        }
        else {
            response.statusCode = 200;
            response.json({
                success: true,
                token
            });
        }
    }
    catch(error) {     
        response.statusCode = 500;   
        response.json({            
            success: false,
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


// Función para actualizar el estatus de una palabra
async function updateUser(request, response) {
    try {
        const id = request.params.id;
        const { language, country, state, urlImage, filters } = request.body;

        // Se utiliza para actualizar la información de un usuario
        const update = await User.setNewData({id, language, country, state, urlImage, filters});

        response.statusCode = 200;
        response.json({
            success: true,
            update
        });
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not insert a new Item a Word',
            error
        });
    }
}


module.exports = {
    getUser,
    getUserById,
    setUser,
    getLogin,
    deleteUser,
    updateUser,
};