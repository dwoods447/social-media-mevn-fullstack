const Post = require('../models/Post'); 
const User = require('../models/User');
const { findById } = require('../models/User');
const mongoose = require('mongoose');
const io = require('../socketio');
module.exports = {
    async getAllPosts(req, res, next){
      //  console.log('Feteching posts on the server');
        // const posts = await Post.find().populate({path: "postedBy" , select:['username','gender', 'generatedUser', 'images.imagePaths']})
        // .populate({path: "comments", select: ['username','gender', 'generatedUser', 'images.imagePaths']});
        console.log(`Auth user: ${JSON.stringify(req.userId)}`)
        const user = await User.findById(req.userId);
        const following  = [...user.following.users];
        following.push(user._id);
        const posts = await Post.find({postedBy: {$in: following}})
        .populate('likes')
        .populate('postedBy')
        .populate('comments.postedBy')
        .sort({'created': -1});
       console.log(`All posts on server: ${JSON.stringify(posts, null, 2)}`);
        return res.json({posts: posts});
    },

    async createPost(req, res, next){
        console.log(`Creating post on the server...`);
        const { text } = req.body;
        console.log(`ID of user that created post: ${req.userId}`)
        console.log(`Req File: ${JSON.stringify(req.file)}`);
        const user = await User.findOne({_id: req.userId});
        console.log(`User info: ${JSON.stringify(user._id)}`);
        try {
        let postContents = {};
        if(!user){
            return res.status(401).json({message: 'User not authenticated'})
        }
        if(text){
            postContents.text = text;
        }
        postContents.postedBy = mongoose.Types.ObjectId(user._id);
        const newPost = new Post(postContents);
        const savedPost = await newPost.save();
        const lastSavedPost = await Post.findById(savedPost._id).populate('likes')
        .populate('postedBy')
        .populate('comments.postedBy');
         if(req.file){
                    const error  = new Error('No image provided');
                    return res.status(422).json({message: error});
                
                 const imageUrl = req.file.filename;
                 console.log(`Image filname ${imageUrl}`)
                 const imageUploaded = await lastSavedPost.addImageToPost(imageUrl);
        }        
        console.log(`Saved Post Contents, ${JSON.stringify(lastSavedPost, null, 2)}`)
        if(!savedPost){
            return res.status(500).json({message: 'Error trying tp save post!'})
        }
        io.getIO().emit('new-posts', {action: 'create', post: lastSavedPost});
        return res.status(200).json({message: 'User post created sucessfully!'})

        }catch(error){
            console.log(error);
        }

       
    },

    async deletePost(req, res, next){
        const user = await User.findById(req.userId); 
        const { postId } = req.body;
        console.log(`Post ID on the server ${postId}`)
        const post = await Post.findOne({_id: postId});
        if(!post){
           return res.status(422).json({message: "Error could not find post."});
        }
        await Post.deleteOne({_id: postId});
        io.getIO().emit('deleteing-post', {action: 'delete-post', post: post});
        console.log(`Post deleted: ${JSON.stringify(post , null, 2)}`);
        return res.status(200).json({message: "Post deleted succesffuly!"});
    },

    async deleteComment(req, res, next){
        const user = await User.findById(req.userId); 
        const { postId, commentId } = req.body;
        console.log(`Post ID on the server ${postId}`)
        console.log(`Comment ID on the server ${commentId}`)
        let post = await Post.findOne({_id: postId}).populate('likes').populate('postedBy')
        .populate('comments.postedBy');
        if(!post){
           return res.status(422).json({message: "Error could not find post."});
        }

        const removedComment = await post.removeCommentFromPost(commentId);
        post = await Post.findOne({_id: postId}).populate('likes').populate('postedBy')
        .populate('comments.postedBy');
        io.getIO().emit('deleteing-comment', {action: 'delete-comment', post: post});
        console.log(`Comment deleted: ${JSON.stringify(post , null, 2)}`);
        return res.status(200).json({message: "Comment deleted succesffuly!"});
    },

    async addCommentToPost(req, res, next){
        console.log('User Id ' + JSON.stringify(req.userId))
        const user = await User.findOne({_id: req.userId});
        if(!user){
            return res.status(401).json({message: 'User not Authenticated'});
        }
       // console.log(`User ${JSON.stringify(user)}`);
        const { postId, comment } = req.body;
        console.log(`Post ID on the server ${postId}`);
        console.log(`Comment on the server ${comment}`);
        const post = await Post.findOne({_id: postId});

        // Check for found post

        if(!post){
            return res.status(422).json({message: 'Post not found'});
        }

        //console.log(`Post found: ${JSON.stringify(post, null, 2)}`);
        const commentAdded =  await post.addCommentToPost(user, comment);
       if(!commentAdded){
        return res.status(422).json({message: 'There was an error adding the comment'})
       }
       return res.status(200).json({message: 'Comment added to post sucessfully!'})
    },
    async addLikeToPost(req, res, next){
        const user  = await User.findById(req.userId); 
        if(!user){
            return res.status(401).json({message: 'User not Authenticated'});
        }
        const { postId } = req.body; 
        console.log(`Post Id: ${postId}`);
        const post = await Post.findOne({_id: postId});  
        console.log(`Post found: ${JSON.stringify(post , null, 2)}`);
        if(!post){
            return res.status(422).json({message: 'Post not found'});
        } 
        const likeAdded = await post.addLikeToPost(user);
        const lastSavedPost = await Post.findById(postId).populate('likes')
        .populate('postedBy')
        .populate('comments.postedBy');
        io.getIO().emit('new-likes', {action: 'hit-like', post: lastSavedPost});
        if(!likeAdded){
            return res.status(422).json({message: 'There was an error adding the like'})
           }
       return res.status(200).json({message: 'Like added to post sucessfully!'})
    }
}



