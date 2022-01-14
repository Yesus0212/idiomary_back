const { trusted, isValidObjectId } = require('mongoose');
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

// Función de actualización del registro
async function setNewItem (request) {

  const {id, newArray} = request;

  const updateComplement = await Word.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: { newArray },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
      returnNewDocument: true,
    }
  );
   
  return updateComplement;
};

// Función de actualización del registro
async function updateArray (request) {

  const {id, idCom, newArray} = request;

  const updateComplement = await Word.updateOne(
    {
      _id: id,
    },
    {
      // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
      $push: {"complements.$[com].translations" : newArray},
    },
    { 
      arrayFilters: [
        // Se requiere un filtro adicional para identificar el complemento a modificar
        {"com._id": idCom},
      ],     
      new: true,
      useFindAndModify: true,
      returnNewDocument: true,
    }
  );
   
  return updateComplement;
};



module.exports = {
    getWords,
    getWordsById,
    setWord,
    deleteWord,
    setNewItem,
    updateArray
};