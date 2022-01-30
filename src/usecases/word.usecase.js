const Word = require('../models/word.model');
const User = require('../models/user.model');
const mongoose = require ('mongoose')

// Función de consulta de todos los Words y filtrado por palabra
async function getWords2(filters) {

  console.log(filters, "Filtros")

  const words = await Word.find(filters);  
  
  return words;
}


// Función de consulta de todos los Words y filtrado por palabra
async function getWords(action) {

  let select, where, and, or, sort;

  if(action !== "" && action !== undefined){
    switch (action) {
      case "words":
        select = ["_id", "word", "type", "userId", "userName", "imgUser", "createdAt", "meaning", "example", "urlImage", "language", "country", "state", "topic", "status"];
        where = {"status": 1}
        and = [{}];
        or = [{}];
        sort = {"createdAt": -1};
        break;
      case "complements":
        select = ["_id", "word", "status", "complements._id", "complements.userId", "complements.userName", "complements.imgUser" ,"complements.createdAt", "complements.meaning", "complements.example", "complements.urlImage", "complements.language", "complements.country", "complements.state", "complements.topic", "complements.status"];
        where = {"status": 2}
        and = [{"complements.status": 1}];
        or = [{}];
        sort = {"complements.createdAt": -1};
        break;
      case "wordTranslations":
        select = ["_id", "word", "meaning", "translations"];        
        where = {"status": 2};
        and =  [{"translations.status": 1}]; 
        or = [{}];
        sort = {};
        break;
      case "compTranslations":
        select = ["_id", "word", "meaning", "complements._id", "complements.translations"];
        where = {"status": 2};
        and = [{"complements.status": 2},{"complements.translations.status": 1}];
        or =  [{}]; 
        sort = {};
        break;      
      default:
          return "Invalid Action"
    }
  }
  else{
    select = [];
    where = {"status": 2};
    and = [{}];
    or = [{}];
    sort = {"createdAt": -1};
  }
  
  const words = await Word.find({})
                          .select(select)
                          .where(where)
                          .and(and)
                          .or(or)
                          .sort(sort);
  
  return words;
}


// Función de consulta de todos los Words y filtrado
async function getWordsByFilters(langs, counts, sts, top) {
  const words = await Word.find()
                          .or([
                            // {$or: [{word: {$regex:search}}]},
                            // {$or: [{meaning: {$regex:search}}]},
                            // {$or: [{example: {$regex:search}}]},
                            {$or: langs},
                            {$or: counts},
                            {$or: sts},
                            {$or: top}
                          ]);

  return words;
}


// Función de consulta por ID
async function getWordsById(request) {
    const id = request;
    const word = await Word.findById(id);
    return word;
}


// Función de consulta por ID de Usuario
async function getWordsByUser(request) {
  const userId = request;

  const filter = {"userId": "61d8ccaf7bb9b8eac22f860e"}

  const word = await Word.find(filter);                          

  return word;
}


// Función de inserción de word nuevo
async function setWord(request) {
  const {word, type, userId, imgUser, userName, meaning, example, urlImage, language, country, state, topic, translations, createdAt, likes, userValidator, status, reason, complements} = request;    
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
    await Word.create({
      word,
      type,
      userId,
      userName,
      imgUser,
      meaning,      
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

    let validation = 1;
    if(translations !== "" && translations !== undefined ){
      validation = 2;
    }
 
    // Aquí actualiza el número de registros en validación del usuario 
    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $inc: {
          inValidation: validation
        }
      }
    );

    return true;
  }
  catch(error){
    // Si ocurre un error, aborta la transacción y deshacer cualquier cambio que pudiera haber ocurrido
    await session.abortTransaction();
    return false;
  } finally {
    // Finaliza la session
    session.endSession();
  }
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
  const {userId, translations} = newArray;          

  const session = await mongoose.startSession()
  session.startTransaction()

  try{
    switch (action) {
      case "translate":
        if(idComplement !== ""){
          await Word.findOneAndUpdate(
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
          await Word.findOneAndUpdate(
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
        // Aquí actualiza el número de registros en validación del usuario 
        await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $inc: {
              inValidation: 1
            }
          }
        );
        break;
      case "complement":
        await Word.findOneAndUpdate(
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
        
        let validation = 1;
        if(translations !== "" && translations !== undefined ){
          console.log(validation, "antes actualizar");
          validation = 2;
        }

        console.log(validation, "despues de actualizar");        
        // Aquí actualiza el número de registros en validación del usuario 
        await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $inc: {
              inValidation: validation
            }
          }
        );         
        break;    
      default:
        console.log("Invalid Action")
        return "Invalid Action"
    } 
    
    return true;
  }
  catch(error){
    // Si ocurre un error, aborta la transacción y deshacer cualquier cambio que pudiera haber ocurrido
    await session.abortTransaction();
    return false;
  } finally {
    // Finaliza la session
    session.endSession();
  }
};


// Función de actualización del estatus del documento
async function updateStatus(request) {

  const {id, userId, idComplement, idTranslate, nameValidator, status, reason} = request;

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    switch (status) {
      case 2:
        if(idComplement !== ""){
          if(idTranslate !== ""){
            await Word.findOneAndUpdate(
              {
                _id: id,
              },
              {
                // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
                $set: {
                  "complements.$[com].translations.$[tra].userValidator" : nameValidator, 
                  "complements.$[com].translations.$[tra].reason" : reason,
                  "complements.$[com].translations.$[tra].status" : status
                }
              },
              { 
                arrayFilters: [
                  // Se requiere un filtro adicional para identificar el complemento a modificar
                  {"com._id": idComplement},
                  {"tra._id": idTranslate}
                ],     
                new: true,
                useFindAndModify: true,
                returnNewDocument: true,
              }
            );
          }
          else{
            await Word.findOneAndUpdate(
              {
                _id: id,
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
                  {"com._id": idComplement}
                ],     
                new: true,
                useFindAndModify: true,
                returnNewDocument: true,
              }
            );
          }
        }
        else{
          await Word.findOneAndUpdate(
            {
              _id: id,
            },
            {
              // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
              $set: {
                userValidator : nameValidator, 
                reason : reason,
                status : status,
              }
            },
            {     
              new: true,
              useFindAndModify: true,
              returnNewDocument: true,
            }
          );
        }
        // Se incrementa en 1 el campo de registros validados y de los puntos de usuario y a la vez se decrementa en 1 el campo de registros en validación
        await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $inc: {
              inValidation: -1,
              validated: 1,
              points: 1
            }
          }
        );            
        break;
      case 3:
        if(idComplement !== ""){
          if(idTranslate !== ""){
            await Word.findOneAndUpdate(
              {
                _id: id,
              },
              {
                // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
                $set: {
                  "complements.$[com].translations.$[tra].userValidator" : nameValidator, 
                  "complements.$[com].translations.$[tra].reason" : reason,
                  "complements.$[com].translations.$[tra].status" : status
                }
              },
              { 
                arrayFilters: [
                  // Se requiere un filtro adicional para identificar el complemento a modificar
                  {"com._id": idComplement},
                  {"tra._id": idTranslate}
                ],     
                new: true,
                useFindAndModify: true,
                returnNewDocument: true,
              }
            );
          }
          else{
            await Word.findOneAndUpdate(
              {
                _id: id,
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
                  {"com._id": idComplement}
                ],     
                new: true,
                useFindAndModify: true,
                returnNewDocument: true,
              }
            );
          }
        }
        else{
          await Word.findOneAndUpdate(
            {
              _id: id,
            },
            {
              // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
              $set: {
                userValidator : nameValidator, 
                reason : reason,
                status : status,
              }
            },
            {     
              new: true,
              useFindAndModify: true,
              returnNewDocument: true,
            }
          );
        }
        // Se decrementa en 1 el campo de registros en validación y se incrementa en 1 el de canceladoss
        await User.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            $inc: {
              inValidation: -1,
              canceled: 1
            }
          }
        );         
        break;
      default:
        console.log("Invalid Action")
        return "Invalid Action"
    }
    return true;
  }
  catch(error){
   // Si ocurre un error, aborta la transacción y deshacer cualquier cambio que pudiera haber ocurrido
   await session.abortTransaction()  
   return false
  } finally {
   // Finaliza la session
   session.endSession()
  }  
};


module.exports = {
    getWords,
    getWords2,
    getWordsByFilters,
    getWordsById,
    getWordsByUser,
    setWord,
    deleteWord,
    setNewItem,
    updateStatus
};