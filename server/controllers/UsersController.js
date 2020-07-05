const User = require('../models/User'); 
const moment = require('moment');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { findOne } = require('../models/User');
const secret = config.authentication.jwtSecret;
const io = require('../socketio');


module.exports = {
    async getSingleUser(req, res, next){
        console.log('Finding user on the server');
        let projection = {password: 0}
        const { userId } = req.body;
        console.log(`User Id re'vd ${userId}`);
        console.log(`User Id re'vd in params ${req.params.userId}`);
        const user = await User.findOne({_id: req.params.userId}, projection)
        .populate('following')
        .populate('followers');
        console.log(`User returned on the server: ${JSON.stringify(user, null, 2)}`)
        return res.status(200).json({user: user});
    },
    async getAllUsers(req, res, next){
        const user = await User.findById(req.userId);
        const allUsers = await User.find();
        return res.status(200).json({users: allUsers});
    },

    async getAllUsersNotFollowed(req, res, next){
        console.log(`Getting all user not followed on server`);
        const user = await User.findById(req.userId);
        const nonFollowedUsers = [...user.following.users];
        nonFollowedUsers.push(user._id);
        const allUsersNotFollowed = await User.find({ _id: { $nin: nonFollowedUsers } });
        console.log(`All users not followed ${JSON.stringify(allUsersNotFollowed )}`);
        return res.status(200).json({users: allUsersNotFollowed});
    },

    async getAllUsersFollowed(req, res, next){
        console.log(`Getting all user followed on server`);
        const user = await User.findById(req.userId);
        const followedUsers = [...user.following.users];
        const allUsersFollowed = await User.find({ _id: { $in : followedUsers } });
        return res.status(200).json({users: allUsersFollowed});
    },

    async updateUser(req, res, next){
        const {username, email, about, password} = req.body;
        let projection = {password: 0, email: 0}
        const user = await User.findOne({_id: req.userId}, projection);
        if(!user){
            return res.status(422).json({message: 'No user found'});
        }
        if(username) user.username = username;
        if(email) user.email = email;
        if(about) user.about = about;
        if(password) user.password = password;
        console.log(`Req File: ${JSON.stringify(req.file)}`);
        user.isProfileComplete = 'true';
        if(req.file){
            const imageUrl = req.file.filename;
            await user.addImageToProfile(imageUrl);
        }
        
        const savedUser = await user.save();
        if(!savedUser){
            return res.status(422).json({message: 'There was an error saving the profile'});
        }
        return res.status(200).json({message: 'User Profile updated successfully!', user: savedUser });
    },

    async deleteUser(req, res, next){
        return res.json({messagae: 'User deleted'});
    },

    async uploadImage(req, res, next){

        const user = await User.findById(req.userId);
        if(!user){
         return res.status(401).json({message: 'Unauthorized you are not logged in!'});
        }
        if(!req.file){
           const error  = new Error('No image provided');
           return res.status(422).json({message: error});
        }

        let imgLength = user.images.imagePaths.length;
        if(imgLength <= 4){
        // const imageUrl = req.file.path;
         const imageUrl = req.file.filename;
         const imageUploaded = await user.addImageToProfile(imageUrl);
          if(!imageUploaded){
             return res.status(422).json({message: 'There was an error uplaoding your image'});
          }
        } else {
           return res.status(422).json({ message: 'You have exceeded the limit to the number of images you can upload' });
        }
         return res.status(200).json({message: 'Image uploaded successfully', user:user});
      },

      async followUser(req, res, next){

        const currentUser = await User.findById(req.userId).populate('following')
        .populate('followers');
       
        if(!currentUser){
            return res.status(401).json({message: 'Unauthorized you are not logged in!'});
         }
         const { userId } = req.body;
         const otherUser = await User.findOne({_id:userId});
         console.log(`Users: ${JSON.stringify(otherUser)} and ${userId}`);
         // Add the current user to the other user's followers list
         const currentUserAddedToUsersFollowerList = await otherUser.addToFollower(currentUser);
         //Add the other user to the current user;s follwing list
         const userAddedToCurrentUsersFollowingList = await currentUser.addToFollowing(otherUser);
         const usersFollowed  = [...currentUser.following.users];
         usersFollowed.push(currentUser._id)
         const usersNotFollowed = await User.find({_id: {$nin: usersFollowed}})
         io.getIO().emit('new-people-list', {action: 'list', lists: usersNotFollowed});
      },

      async unFollowUser(req, res, next){
        return res.status(200).json({message: 'User followed!!'});
      }
}