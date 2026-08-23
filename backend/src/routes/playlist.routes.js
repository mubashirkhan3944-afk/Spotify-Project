const express = require('express');
const router = express.Router();
const playListController = require('../controllers/playlist.controller')
const authMiddleware = require('../middleware/auth.middleware')



router.post('/create-playlist',authMiddleware.checkUser,playListController.createPlayList);
router.post('/add-to-playlist',authMiddleware.checkUser,playListController.addToPlayList);
router.get('/playlist',authMiddleware.checkUser,playListController.getPlayLists);
router.get('/playlist/:id',playListController.getPlayListById);
router.delete('/delete/:id',authMiddleware.checkUser,playListController.deletePlaylist)

module.exports = router;