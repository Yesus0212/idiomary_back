const Word = require('../models/word.model');

// Función de consulta de todos los Words y filtrado
async function getWords(filters) {
    const words = await Word.find(filters);
    return words;
}


// Función de consulta por ID
async function getWordsById(request) {
    const id = request;
    const word = await Word.findById(id);
    return word;
}


// Función de inserción de word nuevo
async function setWord(request) {
    const {word, meaning, example, userName, urlImage, language, country, state, topic, translations, createdAt, likes, userValidator, status, reason, complements} = request;    
    const setWord = await Word.create({
        word,
        meaning,
        userName,
        example,
        urlImage,
        language,
        country,
        state,
        topic,
        translations, 
        createdAt,
        likes,
        userValidator,
        status,
        reason,        
        complements
    });
    return setWord;
}

// Función de eliminación de word por ID
async function deleteWord(request) {
    const id = request;         
    const deleteWord = await Word.findByIdAndDelete(id);
    return deleteWord;
}

module.exports = {
    getWords,
    getWordsById,
    setWord,
    deleteWord,
};