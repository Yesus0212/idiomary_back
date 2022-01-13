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
    const {word, type, meaning, example, userName, urlImage, language, country, state, topic, translations, createdAt, likes, userValidator, status, reason, complements} = request;    
    const setWord = await Word.create({
        word,
        type,
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


// Función de actualización de language por ID
async function updateWord(request) {
    const id = request.id;
    const data = request.word;

    console.log(id, "id");
    console.log(typeof(data), "data");

    const updateLanguage = await Word.findByIdAndUpdate(id, data);

    return updateLanguage;
}

async function updateComplement (request) {

    console.log(request)


    const updateComplement = await Word.findOneAndUpdate(
      {
        _id: request.id,
      },
      {
        $set: { 'word.$.complements': request.complement },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    if (updateComplement === null) {
      await Word.findOneAndUpdate(
        {
          _id: request.id,
        },
        {
          $addToSet: { "word.complements": [request.complement] },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }
    res.json('success');
  };



module.exports = {
    getWords,
    getWordsById,
    setWord,
    deleteWord,
    updateWord,
    updateComplement
};