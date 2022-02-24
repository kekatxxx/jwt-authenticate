const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Not authorized');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, constants.JWT_SECRET);
    }catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authorized');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};