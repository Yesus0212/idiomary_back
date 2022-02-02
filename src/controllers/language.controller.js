const Language = require('../usecases/language.usecase');

async function getLanguage(request, response) {
    try { 

        const {language, country} = request.query;

        const languages = await Language.getLanguages();

        response.statusCode = 200;
        response.json({
            languages
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Languages',
            error
        });
    }
};

async function getLanguageById(request, response) {
    try {
        const id = request.params.id;
        
        const languages = await Language.getLanguagesById(id);

        response.statusCode = 200;
        response.json({
            languages
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not get Language',
            error
        });
    }
};


async function setLanguage(request, response) {
    try {
        const newLanguage = request.body;
        const createLanguage = await Language.setLanguage(newLanguage);

        response.statusCode = 200;
        response.json({
            success: true,
            newLanguage
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not set new Language',
            error
        });
    }
};


async function deleteLanguage(request, response) {
    try {
        const id = request.params.id;

        const deleteLanguage = await Language.deleteLanguage(id);

        response.statusCode = 200;
        response.json({
            success: true,
            deleteLanguage
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false,
            message: 'Could not delete a Language',
            error
        });
    }
};


module.exports = {
    getLanguage,
    getLanguageById,
    setLanguage,
    deleteLanguage,
};