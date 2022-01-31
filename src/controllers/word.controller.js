const Word = require('../usecases/word.usecase');


// Obtiene la información 
async function getWord(request, response) {
    try {

        const {action} = request.query;
        const words = await Word.getWords(action);

        let result;

        if(action === "wordTranslations"){
            result = words.map(({_id, word, meaning, translations}) => {
                return {
                    idWord: _id,
                    word: word,
                    meaning: meaning,
                    translations
                };
            })
        }
        else if(action === "compTranslations"){
            result = words.map(({_id, word, meaning, complements}) => {
                return {
                    idWord: _id,
                    word: word,
                    meaning: meaning,
                    complements
                };
            })
        }
        else {
            result = words;
        }  
        
        response.statusCode = 200;
        response.json({
            result
        })        
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            sucess: false,
            message: 'Could not get Tranlations',
            error
        });
    }
}

async function getWord2(request, response) {
    try {
        
        const userId = request.query;     
        
        console.log(userId, "id del usuario")

        const filters = {};
    
        if(userId) {
            filters.userId =  userId;
        }

        const words = await Word.getWords2(filters);

        response.statusCode = 200;
        response.json({
            words
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Words',
            error
        });
    }
};

async function getWordById(request, response) {
    try {
        const id = request.params.id;
        
        const words = await Word.getWordsById(id);

        response.statusCode = 200;
        response.json({
            words
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Word',
            error
        });
    }
};



async function setWord(request, response) {
    try {
        const newWord = request.body;
        const createWord = await Word.setWord(newWord);


        if(!createWord){
            response.statusCode = 412;
            response.json({
                success: false,
                createWord
            });            
        }
        else{
            response.statusCode = 200;
            response.json({
                success: true,
                createWord
            });
        }
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not set new Word',
            error
        });
    }
};


async function deleteWord(request, response) {
    try {
        const id = request.params.id;

        const deleteWord = await Word.deleteWord(id);

        response.statusCode = 200;
        response.json({
            success: true,
            deleteWord
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not delete a Word',
            error
        });
    }
};

// Función para agregar elementos nuevos a una palabra existente (función definitiva)
async function setNewItemWord(request, response) {
    try {
        const id = request.params.id;
        const { action, idComplement, newArray} = request.body;

        // Se utiliza para agregar un nuevo elemento a de traducción o complemento a la palabra
        const newItem = await Word.setNewItem({id, action, idComplement, newArray});

        if(!newItem){
            response.statusCode = 412;
            response.json({
                success: false,
                newItem
            });            
        }
        else{
            response.statusCode = 200;
            response.json({
                success: true,
                newItem
            });
        }
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


// Función para actualizar el estatus de una palabra
async function updateStatusWord(request, response) {
    try {
        const id = request.params.id;
        const {userId, idComplement, idTranslate, nameValidator, status, reason} = request.body;

        // Una vez que se actualiza el estatus de la palabra, se realiza la actualización de los números del usuario creador
        const newStatus = await Word.updateStatus({id, userId, idComplement, idTranslate, nameValidator, status, reason});

        if(!newStatus){
            response.statusCode = 412;
            response.json({
                success: false,
                newStatus
            });            
        }
        else{
            response.statusCode = 200;
            response.json({
                success: true,
                newStatus
            });
        }
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not update word status',
            error
        });
    }
}

async function getWordsByFilter(request, response) {
    try {

        const {language, country, state, topic, userName, search} = request.query; 

        const filters = {}

        if(language) filters.language = language;
        if(country) filters.country = country;
        if(state) filters.state = state;
        if(topic) filters.topic = topic;
        if(userName) filters.userName = userName;
        if(search){
            filters.word = search;
        }

        // langs = languages.map(element => {
        //      return {"language": element};      
        // });

        // counts = countries.map(element => {
        //     return {"country": element};      
        // });  

        // sts = states.map(element => {
        //     return {"state": element};
        // })

        // top = topics.map(element => {
        //     return {"topic": element};
        // })

        const words = await Word.getWordsByFilters(filters);

        // console.log(filters);

        // const words = await Word.getWords(filters);


        // Ejemplo de envío
        // {
        //     "languages":[""],
        //     "countries":["Colombia"],
        //     "states":[""],
        //     "topics":["Expresiones despectivas"]
        // }

        response.statusCode = 200;
        response.json({
            words
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Words',
            error
        });
    }
};


module.exports = {
    getWord,
    getWord2,
    getWordById,
    getWordsByFilter,
    setWord,
    deleteWord,
    setNewItemWord,
    updateStatusWord
};