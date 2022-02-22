const jwt = require('jsonwebtoken');
const User = require('../usecases/user.usecase');
require('dotenv').config();

async function validateToken(request, response) {
    
    const token = request.headers['access-token'];

    try{
        
        if(token) {
            jwt.verify(token, process.env.API_KEY, async (error, decoded) => {
                if(error){
                    response.statusCode = 403;
                    return response.json({ success: false, message:  'Token inválida'});
                }else {

                    const user = await User.getUsersById(decoded.userId);

                    response.statusCode = 200;
                    response.send({
                        userId: decoded.userId,
                        userName: user.userName,
                        userType: user.userType,
                        filter: user.filter,
                        filters: user.filters,
                        likes: user.likes
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