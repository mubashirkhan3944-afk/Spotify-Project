const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller')
const authMiddleware = require('../middleware/auth.middleware')



router.post('/create-album',authMiddleware.checkArtist,albumController.createAlbum);
router.get('/album',albumController.getAlbum);
router.post('/add-to-album',authMiddleware.checkArtist,albumController.addToAlbum);
router.get('/album/:id',albumController.getAlbumById)
router.delete('/delete/:id',authMiddleware.checkArtist,albumController.deleteAlbum)



module.exports = router;