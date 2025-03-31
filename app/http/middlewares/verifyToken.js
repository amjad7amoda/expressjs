const jwt = require('jsonwebtoken');
const appError = require('../../../utlis/appError')
const {FAIL} = require('../../../utlis/httpStatus')
const { generateToken } = require('../../../utlis/generateJWT')
const User = require('../../models/user.model')
const {getUserById, getUserByEmail} = require('../../../utlis/getUser');
const asyncWrapper = require('./asyncWrapper');

module.exports = asyncWrapper(
    async (req, res, next) =>{
        let authHeader = req.headers['Authorization'] || req.headers['authorization'];
        if(!authHeader)
            return next(appError('You should be logged in', 401, FAIL));
    
        let token = authHeader.split(' ')[1]; 
        let currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if(currentUser){
            req.currentUser = currentUser;
            return next();
        }else{
           return  next(appError('The token is not valid', 401, FAIL))
        }
    }
)