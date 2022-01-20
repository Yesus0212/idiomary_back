const { update } = require('../models/word.model');
const Word = require('../usecases/word.usecase');

async function getWord(request, response) {
    try {
        
        const {search} = request.query;               
        const filters = {};
    
        if(search) {
            filters.word = { $regex: word };
            filters.meaning = { $regex: meaning };
        }

        const words = await Word.getWords(filters);

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
        const {idComplement, idTranslate, nameValidator, status, reason} = request.body;

        const updateComplement = await Word.updateStatus({id, idComplement, idTranslate, nameValidator, status, reason});

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


async function getTranslate(request, response) {
    try {

        const {action} = request.body;

        const words = await Word.getAllTranslates(action);

        response.statusCode = 200;
        response.json({
            words
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
    getWordById,
    setWord,
    deleteWord,
    setNewItemWord,
    updateStatusWord,
    getFilters,
    getTranslate
};