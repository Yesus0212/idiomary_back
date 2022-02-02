const Word = require('../usecases/word.usecase');


// Obtiene la información 
async function getWord(request, response) {
    try {

        const {action, userName} = request.query;

        console.log(action, userName);
        const words = await Word.getWords(action, userName);

        // let result;

        // if(action === "wordTranslations"){
        //     result = words.map(({_id, word, meaning, translations}) => {
        //         return {
        //             idWord: _id,
        //             word: word,
        //             meaning: meaning,
        //             translations
        //         };
        //     })
        // }
        // else if(action === "compTranslations"){
        //     result = words.map(({_id, word, meaning, complements}) => {
        //         return {
        //             idWord: _id,
        //             word: word,
        //             meaning: meaning,
        //             complements
        //         };
        //     })
        // }
        // else {
        //     result = words;
        // }  
        
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

// async function getWordsByUser(request, response) {
//     try {
        
//         const {userName} = request.query;

//         const filters = {};

//         filters.userName = userName;

//         console.log(filters, "Este es el filtro en el control")

//         const wordsUser = await Word.getWordsByUser(filters);

//         response.statusCode = 200;
//         response.json({
//             wordsUser
//         })
//     }
//     catch(error) {
//         console.error(error);
//         response.statusCode = 500;
//         response.json({
//             success: false,
//             message: 'Could not get Words',
//             error
//         });
//     }
// };

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

        const {search} = request.query; 

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
    // getWordsByUser,
    getWordById,
    getWordsByFilter,
    setWord,
    deleteWord,
    setNewItemWord,
    updateStatusWord
};