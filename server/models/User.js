
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const moment = require('moment');
const config = require('../config/config');
const path = require('path');
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    username: {
        type: String,
        required: 'username is required',
    },
    password: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], 
        unique: 'Email already exists'
    },
    about: {
        type: String,
        trim: true
    },
    gender: { 
        type: String
    },
    onlineStatus: {
        type: Boolean,
    },
    generatedUser :{
        type: String, 
    },
    isProfileComplete:{
        type: String, 
    },
    followers: {
        users: [
            {
                userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
            }
        ]
    },
    following: {
        users: [
            {
                userId: {type: Schema.Types.ObjectId, ref: 'User', required: true },
            }
        ]
    },

    images: {
        imagePaths: [
            {   
                imageId: {type: Schema.Types.ObjectId},
                path: { type: String, required: true},
                date: {type: Date}
            }
        ],
    },
    created: {  type: Date,  default: Date.now }, 
    updated: Date,

})



UserSchema.methods.addImageToProfile = function(imagePath){
 
    const updatedImages = [...this.images.imagePaths];
    if(updatedImages.length < 1){
        console.log(`Image added!`);  
        updatedImages.push({
            imageId: mongoose.Types.ObjectId(),
            path: imagePath,
            date: new Date(),
        })
    } else {
        updatedImages[0].path = imagePath;
        updatedImages[0].date = new Date();
    } 
    
    this.images.imagePaths = updatedImages;
    return this.save();
}

UserSchema.methods.removeImageFromProfile = function(imageId){
   
    const targetImg = this.images.imagePaths.find(target =>{
        return target.imageId.toString() === imageId;
      })
       const imgPth = path.join(__dirname + '/./../../assets/static/uploads/', targetImg.path);
       try{
         fs.unlinkSync(imgPth);
       } catch(err){
         console.error(`Error deleting file: ${err}`);
       }
  
      const userImages = this.images.imagePaths.filter(image =>{
          return image.imageId.toString() !== imageId;
      })
      this.images.imagePaths = userImages;
      return this.save();
}


UserSchema.methods.addToFollower = function(user){
    const followerIndex = this.followers.users.findIndex(follower => {
        return user._id.toString() === follower._id.toString();
    });

    const updatedFollowers = [...this.followers.users];

    if(followerIndex ===  -1){
         // User is not in block user list add them
         updatedFollowers.push({
             _id: mongoose.Types.ObjectId(user._id),
            userId: mongoose.Types.ObjectId(user._id),
        })
    }

    const newFollowers = {
        users:  updatedFollowers
    }
    this.followers  =  newFollowers;
    return this.save();
}

UserSchema.methods.addToFollowing = function(user){
    const followerIndex = this.following.users.findIndex(follower => {
        return user._id.toString() === follower._id.toString();
    });

    const updatedFollowing = [...this.following.users];

    if(followerIndex ===  -1){
         // User is not in block user list add them
         updatedFollowing.push({
            _id: mongoose.Types.ObjectId(user._id), 
            userId: mongoose.Types.ObjectId(user._id),
        })
    }
    const newFollowing = {
        users:  updatedFollowing
    }
    this.following  =  newFollowing;
    return this.save();
}


module.exports = mongoose.model('User', UserSchema);