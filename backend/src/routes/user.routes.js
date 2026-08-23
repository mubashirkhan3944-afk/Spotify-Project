const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');




router.get('/',authMiddleware.checkUser,userController.getUser);
router.get('/user/:id',authMiddleware.checkUser,userController.getUserData);
router.get('/artist',userController.getArtists)




module.exports = router;