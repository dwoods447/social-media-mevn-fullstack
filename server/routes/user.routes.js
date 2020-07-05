const express = require('express');

const UsersController = require('../controllers/UsersController');

const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')



router.get('/all/users', UsersController.getAllUsers);
router.get('/find/user/:userId', UsersController.getSingleUser);
router.get('/get/users/followed', isAuthenticated, UsersController.getAllUsersFollowed);
router.get('/get/users/notfollowed', isAuthenticated, UsersController.getAllUsersNotFollowed)
router.post('/update/user/:userId/edit', isAuthenticated, UsersController.updateUser);
router.post('/user/:userId/delete', isAuthenticated, UsersController.deleteUser);
router.post('/image/upload', isAuthenticated, UsersController.uploadImage);
router.post('/follow/user', isAuthenticated, UsersController.followUser);
router.post('/unfollow/user', isAuthenticated, UsersController.unFollowUser);

module.exports = router;
