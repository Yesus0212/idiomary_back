const User = require('../usecases/user.usecase');

async function validateToken(request, response) {
    
    try{
                
        response.statusCode = 202;
        response.json({
            success: true
        })
    }
    catch(error) {
        console.error(error);
        response.statusCode = 500;
        response.json({
            success: false
        })
    }
   
};


module.exports = {
    validateToken,
};