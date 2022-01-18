const Word = require('../usecases/word.usecase');

async function getWord(request, response) {
    try {
        
        const {search, languages, countries, states, topics} = request.body; 

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

        const words = await Word.getWords(search, langs, counts, sts, top);

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

    // {$or: [{country: ""}, {country: "Colombia"},{topic: "Expresiones despectivas"}]}


        // const {languages, countries, states, topics} = request.body;       
        
        const filters = {};

        // if(languages !== null){
        //     filters.language = languages.forEach(lan => {
        //        return language: lan
        //     })
        // }

        // console.log(filters.language)

        // filters.language = [language];
        // filters.country = [country];
        // filters.topic = [topic]
        // filters.state = [state];
    
        // const words = await Word.getWords(find);

        response.statusCode = 200;
        response.json({
            filters
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
    getWordById,
    setWord,
    deleteWord,
    setNewItemWord,
    updateStatusWord,
    getFilters
};