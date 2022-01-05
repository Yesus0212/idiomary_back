const User = require('../models/user.model');

// Función de consulta de todos los Post y filtrado
async function getUsers(filters) {
    const users = await User.find(filters);
    return users;
}


// Función de consulta por ID
async function getUsersById(request) {
    const id = request;
    const user = await User.findById(id);
    return user;
}


// Función de inserción de post nuevo
async function setUser(request) {
    const {userName, email, password, language, country, state, urlImage, userType, points, filters} = request;    
    const setUser = await User.create({
        userName,
        email,
        password,
        language,
        country,
        state,
        urlImage,
        userType, 
        points,
        filters
    });
    return setUser;
}

// Función de eliminación de post por ID
async function deleteUser(request) {
    const id = request;         
    const deleteUser = await User.findByIdAndDelete(id);
    return deleteUser;
}

module.exports = {
    getUsers,
    getUsersById,
    setUser,
    deleteUser,
};