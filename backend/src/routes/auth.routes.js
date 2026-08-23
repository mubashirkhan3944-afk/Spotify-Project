const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')
const multer = require('multer');


const upload = multer({storage:multer.memoryStorage()})


router.post('/register',upload.single('image'),authController.registerUser);
router.post('/login',authController.loginUser)
router.get('/logout',authController.logoutUser)
router.get('/me',authMiddleware.checkLogin)





module.exports = router;