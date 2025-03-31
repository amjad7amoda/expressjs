const jwt = require('jsonwebtoken')

const generateToken = (payload, expiresDate = '30m') => {
    return jwt.sign(
       payload, 
       process.env.JWT_SECRET_KEY, 
       {expiresIn: expiresDate}
   );
};


module.exports = {
    generateToken
} 