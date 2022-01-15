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

// Esta función, permite agregar una traducción, complemento nuevo a una palabra dada o agregar una nueva traducción a un complemento dado
async function setNewItem (request) {

  const {id, action, idComplement, newArray} = request;

  let updateComplement;

  switch (action) {
    case "translate":
      if(idComplement !== ""){
        updateComplement = await Word.findOneAndUpdate(
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
              {"com._id": idComplement},
            ],     
            new: true,
            useFindAndModify: true,
            returnNewDocument: true,
          }
        );
      }
      else{
        updateComplement = await Word.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $push: {translations: newArray} ,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: true,
            returnNewDocument: true,
          }
        );
      }
      break;
    case "complement":
      updateComplement = await Word.findOneAndUpdate(
        {
          _id: id,
        },
        {
          // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
          $push: {complements : newArray},
        },
        {               
          new: true,
          useFindAndModify: true,
          returnNewDocument: true,
        }
      );    
      break;
  
    default:
      return "Invalid action";
  } 
   
  return updateComplement;
};


// Función de actualización del estatus del documento
async function updateStatus (request) {

    const {id, idComplement, idTranslate, nameValidator, status, reason} = request;

    let updateWord;
    let bulk = Word.bulkWrite()
    
    if(idComplement !== ""){
      if(idTranslate !== ""){

        bulk.find(
          { 
            _id: id
          }, 
          {
          // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
          $set: {
            "complements.$[com].userValidator" : nameValidator, 
            "complements.$[com].reason" : reason,
            "complements.$[com].status" : status,
          }
        },
        { 
          arrayFilters: [
            // Se requiere un filtro adicional para identificar el complemento a modificar
            {"com._id": idComplement},
            {"com.status": "1" }
          ],     
          new: true,
          useFindAndModify: true,
          returnNewDocument: true,
        } )

        updateWord = await Word.findOneAndUpdate(
          {
            _id: id,
          },
          {
            // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
            $set: {
              "complements.$[com].userValidator" : nameValidator, 
              "complements.$[com].reason" : reason,
              "complements.$[com].status" : status,
              "complements.$[com].translations.$[tra].userValidator" : nameValidator, 
              "complements.$[com].translations.$[tra].reason" : reason,
              "complements.$[com].translations.$[tra].status" : status
            }
          },
          { 
            arrayFilters: [
              // Se requiere un filtro adicional para identificar el complemento a modificar
              {"com._id": idComplement},
              {"com.status": "1" },
              {"tra._id": idTranslate}
            ],     
            new: true,
            useFindAndModify: true,
            returnNewDocument: true,
          }
        );
      }
    }
   
  return updateComplement;
};



module.exports = {
    getWords,
    getWordsById,
    setWord,
    deleteWord,
    setNewItem,
    updateStatus
};