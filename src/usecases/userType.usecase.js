const UserType = require('../models/userType.model');

// Función de consulta de todos los UserType y filtrado
async function getUserTypes(filters) {
    const userTypes = await UserType.find(filters);
    return userTypes;
}


// Función de consulta por ID
async function getUserTypesById(request) {
    const id = request;
    const userType = await UserType.findById(id);
    return userType;
}


// Función de inserción de userType nuevo
async function setUserType(request) {
    const {userType, pointsToBe} = request;    
    const setUserType = await UserType.create({
        userType,
        pointsToBe,
    });
    return setUserType;
}

// Función de eliminación de userType por ID
async function deleteUserType(request) {
    const id = request;         
    const deleteUserType = await UserType.findByIdAndDelete(id);
    return deleteUserType;
}

module.exports = {
    getUserTypes,
    getUserTypesById,
    setUserType,
    deleteUserType,
};