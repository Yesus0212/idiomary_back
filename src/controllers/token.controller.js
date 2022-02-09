const jwt = require('jsonwebtoken');
require('dotenv').config();

async function validateToken(request, response) {
    
    const token = request.headers['access-token'];

    try{
        
        if(token) {
            jwt.verify(token, process.env.API_KEY, (error, decoded) => {
                if(error){
                    response.statusCode = 403;
                    return response.json({ success: false, message:  'Token inválida'});
                }else {
                    response.statusCode = 200;
                    response.send({
                        userId: decoded.userId,
                        userName: decoded.userName,
                        userType: decoded.userType
                    })
                }
            })
        }
        else {
            response.statusCode = 403;
            response.send({
                success: false,
                message: 'Token no proveída'
            })
        }
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