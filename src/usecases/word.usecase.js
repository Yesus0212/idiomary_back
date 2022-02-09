const Word = require('../models/word.model');
const User = require('../models/user.model');
const UserType = require('../models/userType.model');
const mongoose = require ('mongoose');
const { type } = require('express/lib/response');


// Función de consulta de todos los Words y filtrado por palabra
async function getWords(action, userName) {

  if(action !== "" && action !== undefined && action === "pendings" && (userName !== "" || userName === undefined)){

    const words = await Word.find({})
                            .where({"status": 1})
                            .select(["_id", "word", "type", "userId", "userName", "imgUser", "createdAt", "meaning", "example", "urlImage", "language", "country", "state", "topic", "status"])
                            .sort({"createdAt": -1});

    const comp = await Word.find({})
                                  .select(["_id", "word", "status", "complements._id", "complements.userId", "complements.userName", "complements.imgUser" ,"complements.createdAt", "complements.meaning", "complements.example", "complements.urlImage", "complements.language", "complements.country", "complements.state", "complements.topic", "complements.status"])
                                  .where({"status": 2})
                                  .and([{"complements.status": 1}])
                                  .sort({"complements.createdAt": -1});

    const wTranslations = await Word.find({})
                                        .select(["_id", "word", "meaning", "language", "country", "state", "translations"])
                                        .where({"status": 2})
                                        .and([{"translations.status": 1}]); 

    const cTranslations = await Word.find({})
                                        .select(["_id", "word", "meaning", "language", "country", "state", "complements._id", "complements.translations"])
                                        .where({"status": 2})
                                        .and([{"complements.status": 2},{"complements.translations.status": 1}]);

    const complements = getFilterComplements(comp);
    const wordTranslations = getFilterWordTranslations(wTranslations);
    const compTranslations = getFilterCompTranslations(cTranslations);
                                      

    return pendings = {
                        words, 
                        complements, 
                        wordTranslations, 
                        compTranslations
                      };
  }
  else if(userName !== "" && userName !== undefined && (action === "" || action === undefined)){

    const words = await Word.find({userName: userName})
                            .select(["_id", "word", "meaning", "likes", "status", "reason"])
                            .sort({"createdAt": -1});

    const comp = await Word.find({"complements.userName": userName})
                           .select(["complements._id", "word", "complements.meaning", "complements.likes", "complements.status", "complements.reason"])
                           .sort({"complements.createdAt": -1});

    // Render respuesta de consulta a la base de palabras
    const complements = getComplements(comp)
  
    const wTra = await Word.find({"translations.userName": userName})
                           .select(["word", "meaning", "translations._id", "translations.translate", "translations.status", "translations.reason"])
                           .sort({"createdAt": -1});

    const wordTranslations = getWordTranslations(wTra);

    const cTra = await Word.find({"complements.translations.userName": userName})
                           .select(["word", "complements.meaning", "complements.translations._id", "complements.translations.translate", "complements.translations.status", "complements.translations.reason"])
                           .sort({"complements.createdAt": -1});
                    
    const compTranslations = getCompTranslations(cTra);

    return wordsUser = {
                          words, 
                          complements, 
                          wordTranslations, 
                          compTranslations
                        };
  }
  else{
    const words = await Word.find({})
                          .where({"status": 2})
                          .sort({"createdAt": -1});
  
    return words;
  }

}


function getFilterComplements(comp) {

  const final = comp.map((complement) => {
    
    const complements = complement.complements.filter((complement) => {
      return complement.status == 1;
    })    

    return {
      "_id": complement._id,
      "word": complement.word,
      "status": complement.status,
      "complements": complements
    }

  })

  return final;
}

function getFilterWordTranslations(wTranslations){

  const final = wTranslations.map((translation) => {
    
    const translations = translation.translations.filter((translate) => {
      return translate.status == 1;
    })

    return {
      "_id": translation._id,
      "word": translation.word,
      "meaning": translation.meaning,
      "language": translation.language,
      "country": translation.country,
      "state": translation.state,
      "translations": translations
    }
  })

  return final;
}

function getFilterCompTranslations(cTranslations){
  
  const final = cTranslations.map((complement) => {
    
    const finalComp = complement.complements.filter((complement) => {
      return complement.translations.length > 0;
    })

    return {
      "_id": complement._id,
      "word": complement.word,
      "meaning": complement.meaning,
      "language": complement.language,
      "country": complement.country,
      "state": complement.state,
      "complements": finalComp        
    }
  })

  return final;
}


function getComplements(comp) {

  const final = comp.map(({word, complements}) => {

    const co = complements.map((complement) => {

      const coFinal = {
        _id: complement._id,
        word,
        meaning: complement.meaning,
        likes: complement.likes,
        status: complement.status,
        reason: complement.reason,        
      }

      return coFinal;
      
    })
   
    return co;

  })

  return final;
}


function getWordTranslations(wTra) {

  const final = wTra.map(({word, meaning, translations}) => {

    const tra = translations.map((translation) => {

      const traFinal = {
        _id: translation._id,
        word,
        meaning,
        likes: 0,
        translate: translation.translate,
        status: translation.status,
        reason: translation.reason
      }

      return traFinal;
      
    })
   
    return tra;

  })

  return final;

}

function getCompTranslations(cTra) {  
  
  const comTra = cTra.map(({word, complements}) => {

    const com = complements.filter(({meaning, translations}) => {

      if(translations.length > 0){
        return {
          meaning, 
          translations
        }
      }      

    })
    
    const finalCom = com.map((translations) => {     
      
      const final = translations.translations.map((translation) => {

        const traFinal = {
          _id: translation._id,
          word,
          meaning: translations.meaning,
          likes: 0,
          translate: translation.translate,
          status: translation.status,
          reason: translation.reason
        }
  
        return traFinal;
      })

      return final;

    })

    return finalCom;

  })
  
  return comTra;
}



async function getWordsByFilters(filters) {

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
        break;    
      default:
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


// Función para obtener un item especifico 
async function getDetail(request) {
  
  const { idWord, idComplement, idTranslate } = request;

  const word = await Word.findById(idWord);

  const data = detailWord(word, idComplement, idTranslate);

  return data;
}


function detailWord(word, idComplement, idTranslate) {

  let data = {}

  if(idComplement){
    if(idTranslate){
      const complement = word.complements.filter((complement) => {
        return complement._id == idComplement;
      });

      let translation;

      complement.filter(({translations}) => {
        translation = translations.filter((translation) => {
          return translation._id == idTranslate;
        })
      });

      data = {
        _id: complement[0]._id,
        word: word.word,
        userId: complement[0].userId,
        userName: complement[0].userName,
        imgUser: complement[0].imgUser,
        meaning: complement[0].meaning,
        example: complement[0].example,
        urlImage: complement[0].urlImage,
        language: complement[0].language,
        country: complement[0].country,
        state: complement[0].state,
        topic: complement[0].topic,
        likes: complement[0].likes,
        createdAt: complement[0].createdAt,
        translations: translation[0]
      }
      
    }
    else{
      const complement = word.complements.filter((complement) => {
        return complement._id == idComplement;
      })

      data = {
        _id: complement[0]._id,
        word: word.word,
        userId: complement[0].userId,
        userName: complement[0].userName,
        imgUser: complement[0].imgUser,
        meaning: complement[0].meaning,
        example: complement[0].example,
        urlImage: complement[0].urlImage,
        language: complement[0].language,
        country: complement[0].country,
        state: complement[0].state,
        topic: complement[0].topic,
        likes: complement[0].likes,
        createdAt: complement[0].createdAt,

      }
    }
  }
  else{
    if(idTranslate){
      const translate = word.translations.filter((translate) => {
        return translate._id == idTranslate;
      })

      data = {
        _id: word._id,
        word: word.word,
        userId: word.userId,
        userName: word.userName,
        imgUser: word.imgUser,
        meaning: word.meaning,
        example: word.example,
        urlImage: word.urlImage,
        language: word.language,
        country: word.country,
        state: word.state,
        topic: word.topic,
        likes: word.likes,
        createdAt: word.createdAt,
        translations: translate[0]
      }
    }
    else{
      data = {
        _id: word._id,
        word: word.word,
        userId: word.userId,
        userName: word.userName,
        imgUser: word.imgUser,
        meaning: word.meaning,
        example: word.example,
        urlImage: word.urlImage,
        language: word.language,
        country: word.country,
        state: word.state,
        topic: word.topic,
        likes: word.likes,
        createdAt: word.createdAt
      }
    }
  }

  return data;

}


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
          if(idTranslate !== ""){
            await Word.findOneAndUpdate(
              {
                _id: id,
              },
              {
                // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
                $set: {
                  "translations.$[tra].userValidator" : nameValidator, 
                  "translations.$[tra].reason" : reason,
                  "translations.$[tra].status" : status
                }
              },
              { 
                arrayFilters: [
                  // Se requiere un filtro adicional para identificar el complemento a modificar
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
        const user = await User.findById(userId);
        const userType = await UserType.findOne({userType: "Moderador"});

        if(user.userType !== userType.userType && user.points >= userType.pointsToBe){
          await User.findOneAndUpdate(
            {
              _id: userId,
            },
            {
              $set: {userType: userType.userType}
            }
          )
        }
        
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
          if(idTranslate !== ""){
            await Word.findOneAndUpdate(
              {
                _id: id,
              },
              {
                // Se requiere agregar un identificador del complemento, para que este pueda insertar el nuevo elemento al arreglo de traducciones
                $set: {
                  "translations.$[tra].userValidator" : nameValidator, 
                  "translations.$[tra].reason" : reason,
                  "translations.$[tra].status" : status
                }
              },
              { 
                arrayFilters: [
                  // Se requiere un filtro adicional para identificar el complemento a modificar
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
    getWordsByFilters,
    getWordsById,
    setWord,
    setNewItem,
    getDetail,
    updateStatus,
    deleteWord
};