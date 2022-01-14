const Word = require('../usecases/word.usecase');

async function getWord(request, response) {
    try {
        const {word, meaning} = request.query;               
        const filters = {};
    
        if(meaning) filters.meaning = { $regex: meaning };
        if(word) filters.word = { $regex: word };

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


async function updateWord(request, response) {
    try {
        const id = request.params.id;
        const newArray = request.body;

        // const updateWord = await Word.updateWord({id, word})

        const updateComplement = await Word.updateComplement({id, newArray});

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


module.exports = {
    getWord,
    getWordById,
    setWord,
    deleteWord,
    updateWord
};