const User = require('../models/User'); 
const moment = require('moment');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const secret = config.authentication.jwtSecret;

const transporter = nodemailer.createTransport(sendGridTransport({
auth: {
    api_key: config.node_mailer_key
}
}));


module.exports = {

    async userRegistration(req, res, next){
        let statusCode;
        const { username, email, password, gender  } =  req.body;
        const userName = await User.findOne({username: username});
        if(userName){
            statusCode = 422;
            return res.status(422).json({message: 'Username already exists!', statusCode: statusCode});
        }
        const userEmail = await User.findOne({email: email});
        if(userEmail){
            statusCode = 422;
            return res.status(422).json({message: 'That Email already exists!', statusCode: statusCode});
        }

        
        // const hashedPassword = bcrypt.hashSync(password, 12);

        console.log(`Request Body ${JSON.stringify(req.body)}`);


        const newUser = new User({
            username: username,
            password: password,
            email: email,
            onlineStatus: false,
            gender: gender,
            generatedUser: 'false',
            isProfileComplete:'false',
         
            followers: {
                users: [
                    
                ]
            },
            following: {
                users: [
                   
                ]
            },
        
            images: {
                imagePaths: [
                  
                ],
            },
            created: Date.now() , 
            updated: Date.now(),
        })

        const savedUser = await newUser.save();
        if(!savedUser){
            statusCode = 500;
            return res.status(500).json({message: `There was an error saving a new user please try again `, statusCode: statusCode});
        }
        
        console.log('Sent Mail');
        // transporter.sendMail({
        //     to: email,
        //     from: 'InTheMixSocialApp',
        //     subject: 'Welcome to InTheMixSocialApp',
        //     html: `
        //     <h1>Welcome, ${newUser.username} to InTheMixSocialApp</h1>
        //     <div>
        //       You have successfully registered!
        //     </div>

        //     `
        // })
        statusCode = 200;
        return res.status(statusCode).json({message: 'User succesfully signed up!', user: savedUser, statusCode: statusCode})
    },
   

    async userLogin(req, res, next){
        let statusCode;
        console.log(`authenticating....`);
        const {username , password } = req.body;
        const user = await User.findOne({username: username});
        if(!user){
            statusCode = 403;
            return res.status(403).json({message: 'Invalid username/password',  statusCode: statusCode});
        }
        // Unecrypted password
        const passwordMatch = (password === user.password) ? true: false;
         // Ecrypted password
     //   const passwordMatch = bcrypt.compareSync(password, user.password);
        if(!passwordMatch){
            statusCode = 403;
            return res.status(403).json({message: 'Invalid username/password'});
        }
        console.log('Successfully signed in');

        const returnedUser = await User.findOne({username: username}, {password: 0})
        const token = jwt.sign({
            email: user.email, 
            userId: user._id.toString()
            }, secret, { expiresIn: '1h' });
        user.onlineStatus = true;
        user.save();    
        const decodedToken = jwt.verify(token, secret);  
         console.log(`Decoded Token ${JSON.stringify(decodedToken)}`);
         console.log(`Decoded Token Expires ${JSON.stringify(decodedToken.exp)}`);
        res.status(200).json({token: token, user: returnedUser, tokenExpiresIn: decodedToken.exp, userId: user._id.toString()});
    },

    async userLogout(req, res, next){
        const user1 = await User.findOne({_id: req.userId});
        console.log(`User 1: ${JSON.stringify(user1, null, 2)}`);
        if(!user1){
            return res.status(401).json({message: 'User 1 Not authneticated'});
        }

        const userSaved = user1.save();
        if(!userSaved){
            return res.status(500).json({message: 'User 1 Not saved'});
        }
        return res.status(200).json({message: 'Status updated succesfully.'});
    },



    async resetPassword(req, res, next){
        const { email } = req.body;
        console.log(`Searching for user.....`);
        try {
              const user = await User.findOne({email: email}, {password: 0});
                 if(!user){
                     console.log(`User doesnt exists.`);
                     return res.status(200).json({message: "No user account with that email exists."});
                 }
 
                 const token = jwt.sign({
                     email: user.email,
                     userId: user._id.toString(),
                     password: user.password,
                     }, secret, {expiresIn: '1h'});
 
                 user.resetToken = token;
                 user.resetTokenExpiration = Date.now() + 3600000;
                 const updatedUser = await user.save();
                 let hostname = req.headers.host;
                 if(updatedUser){
                     
                     transporter.sendMail({
                         to: user.email,
                         from: 'MySocialApp',
                         subject: 'Password Reset for MySocialApp',
                         html: `
                         <h1></h1>
                         <div>
                            If you requested a password reset click the link below to reset your password.
                            Click this <a href="http://${hostname}/updatepassword/user/${user._id.toString()}/token/${token}/">link</a> to set a new password.
                         </div>
                         `
                     })
 
                     return res.status(200).json({message: "If a user with that account exists you will recieve an email within the hour with password reset instructions."});
                 }
              } catch(err){
                 console.log(err);
              }
          
    },

    async checkEmailUnique(req, res, next){
        const { email } =  req.body;
        const userEmail = await User.findOne({email: email});
        if(!userEmail){
          return res.status(200).json({message: 'Email not found', emailExists: false});
        }
        return res.status(200).json({message: 'Email already exists!', emailExists: true});
     },

     
    async updatePassword(req, res, next){
        const { userId, token , password } = req.body;
        const  user = User.findOne({_id: userId}, {password: 0});
        if(!user){
            return res.status(422).json({message: "We could not find the user in the system."});
        }

        const hashedPassword = bcrypt.hashSync(password, 12);

        user.password = hashedPassword;
        const savedPassword = await user.save();
        return res.status(200).json({message: "Password updated successfully!"});
    }   


    
}
