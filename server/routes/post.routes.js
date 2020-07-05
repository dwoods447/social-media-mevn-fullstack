const express = require('express');

const PostsController = require('../controllers/PostsController');

const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')


router.get('/all/posts', isAuthenticated, PostsController.getAllPosts);
router.post('/delete/:postID/post', isAuthenticated, PostsController.deletePost);
router.post('/delete/:postID/comment/:commentId', isAuthenticated, PostsController.deleteComment);
router.post('/create/post', isAuthenticated, PostsController.createPost);
router.post('/add/comment/:postId/post', isAuthenticated, PostsController.addCommentToPost);
router.post('/add/like/:postId/post', isAuthenticated, PostsController.addLikeToPost);
module.exports = router;