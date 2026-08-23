const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music.controller')
const authMiddleware = require('../middleware/auth.middleware')
const multer = require('multer')


const Upload = multer({storage:multer.memoryStorage()});


router.post('/create-music',authMiddleware.checkArtist,Upload.fields([{name:'music'},{name:'image'}]),musicController.createMusic);
router.get('/',musicController.getMusic);
router.get('/:id',musicController.getMusicById);
router.delete('/delete/:id',authMiddleware.checkArtist,musicController.deleteMusic)


module.exports = router;