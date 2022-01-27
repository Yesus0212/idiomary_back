const Word = require('../usecases/word.usecase');
const User = require('../usecases/user.usecase');

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

async function getWordsByUser(request, response) {
    try {
        const userId = request.params.userId;
        
        const words = await Word.getWordsByUser(userId);

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
        const createWord = await Word.setWord(newWord)
                                    .then(User.setStatusWords());

        response.statusCode = 200;
        response.json({
            success: true,
            newWord
        })
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
        const updateComplement = await Word.setNewItem({id, action, idComplement, newArray});

        response.statusCode = 200;
        response.json({
            success: true,
            updateComplement
        })

    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not update a Word',
            error
        });
    }
}


// Función para actualizar el estatus de una palabra
async function updateStatusWord(request, response) {
    try {
        const id = request.params.id;
        const {idUser, idComplement, idTranslate, nameValidator, status, reason} = request.body;

        // Una vez que se actualiza el estatus de la palabra, se realiza la actualización de los números del usuario creador
        const updateComplement = await Word.updateStatus2({id, idUser, idComplement, idTranslate, nameValidator, status, reason});

        if(!updateComplement){
            response.statusCode = 412;
            response.json({
                success: true,
                updateComplement
            });            
        }
        else{
            response.statusCode = 200;
            response.json({
                success: true,
                updateComplement
            });
        }
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not update a Word',
            error
        });
    }
}

async function getFilters(request, response) {
    try {

        const {languages, countries, states, topics} = request.body; 

        // const filters = {};

        // if(search){
        //     filters.meaning = { $regex: search };
        //     filters.word = { $regex: search };
        // } 
        // if(language.length) filters.language = language;
        // if(country.length) filters.country = country;
        // if(state.length) filters.state = state;
        // if(topic.length) filters.topic = topic;


        let langs;
        let counts;
        let sts;
        let top;

        langs = languages.map(element => {
             return {"language": element};      
        });

        counts = countries.map(element => {
            return {"country": element};      
        });  

        sts = states.map(element => {
            return {"state": element};
        })

        top = topics.map(element => {
            return {"topic": element};
        })

        const words = await Word.getWordsByFilters(langs, counts, sts, top);

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


async function getWord(request, response) {
    try {

        const {action} = request.body;

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

module.exports = {
    getWord,
    getWord2,
    getWordById,
    getWordsByUser,
    setWord,
    deleteWord,
    setNewItemWord,
    updateStatusWord,
    getFilters
};