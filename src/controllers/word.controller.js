const Word = require('../usecases/word.usecase');

// Obtiene la información 
async function getWord(request, response) {
    try {

        const {action, userName, page} = request.query;

        const words = await Word.getWords(action, userName, page);

        console.log(words, "respuesta de las palabras")
        
        response.statusCode = 200;
        response.json(
            words
        )        
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            sucess: false,
            message: 'Could not get Words',
            error
        });
    }
}


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
        const {data, urlImage} = request.body;
        const createWord = await Word.setWord({data, urlImage});

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
        const {urlImage, data}= request.body;

        // Se utiliza para agregar un nuevo elemento a de traducción o complemento a la palabra
        const newItem = await Word.setNewItem({id, urlImage, data});

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


// Función para obtener la información de un item a validar
async function getDetailWord(request, response) {

    try {
        
        const { idWord, idComplement, idTranslate } = request.query;
    
        const result = await Word.getDetail({ idWord, idComplement, idTranslate });

        response.statusCode
        response.json({
            result
        })
        
    } catch (error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get word',
            error
        })
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

        const {language, country, state, topic, search} = request.query; 

        const filters = {}

        if(search){
            const REG_EXP_SEARCH = {$regex: search, $options: "i"};

            filters.$or = [
                {word: REG_EXP_SEARCH},
                {meaning: REG_EXP_SEARCH},
                {example: REG_EXP_SEARCH},
                {topic: REG_EXP_SEARCH},
                {"translations.translate": REG_EXP_SEARCH},
                {"complements.meaning": REG_EXP_SEARCH},
                {"complements.example": REG_EXP_SEARCH},
                {"complements.topic": REG_EXP_SEARCH},
                {"complements.translations.translate": REG_EXP_SEARCH}
            ]
        }
        
        if(language){
            filters.language = language;
        }
        if(country){
            filters.country = country;
        }
        if(state){
            filters.state = state;
        }
        if(topic){
            filters.topic = topic;
        }

        const words = await Word.getWordsByFilters(filters);

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
    getWordById,
    getWordsByFilter,
    setWord,
    deleteWord,
    setNewItemWord,
    getDetailWord,
    updateStatusWord
};