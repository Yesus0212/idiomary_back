const Language = require('../models/language.model');

// Función de consulta de todos los Languages y filtrado
async function getLanguages(filters) {
    const languages = await Language.find(filters);
    return languages;
}


// Función de consulta por ID
async function getLanguagesById(request) {
    const id = request;
    const language = await Language.findById(id);
    return language;
}


// Función de inserción de language nuevo
async function setLanguage(request) {
    const {language, countries} = request;    
    const setLanguage = await Language.create({
        language,
        countries,
    });
    return setLanguage;
}

// Función de eliminación de language por ID
async function deleteLanguage(request) {
    const id = request;         
    const deleteLanguage = await Language.findByIdAndDelete(id);
    return deleteLanguage;
}

module.exports = {
    getLanguages,
    getLanguagesById,
    setLanguage,
    deleteLanguage,
};