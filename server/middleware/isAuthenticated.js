const jwt = require('jsonwebtoken');
const config  = require('../config/config');
module.exports = (req, res, next) => {
  const authorizedHeader = req.get('Authorization');
  console.log('Checking Auth Token....');
  if(!authorizedHeader){
    const error  = new Error('Not Authenticated.');
    console.log('Auth Token invalid');
    error.statusCode = 401;
    throw error;
  }
  // ['Bearer ' 'tokenString']
  const token  = authorizedHeader.split(' ')[1];
  let decodedToken;
  try {
    console.log('Decoding token.....');
    decodedToken = jwt.verify(token, config.authentication.jwtSecret);
   
  } catch(err){
    err.statusCode = 500;
    next(err);
  } 
  
  if(!decodedToken){
    const error  = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }
  console.log('Valid Token on server'); 
    req.userId = decodedToken.userId;
    next();
}