const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const albumCtrl = require('../controllers/albumController');
const mediaCtrl = require('../controllers/mediaController');
const upload = require('../middleware/upload');

// Album routes
router.post('/', authenticate, albumCtrl.createAlbum);
router.get('/', authenticate, albumCtrl.getMyAlbums);
router.get('/:id', authenticate, albumCtrl.getAlbum);
router.put('/:id', authenticate, albumCtrl.updateAlbum);
router.delete('/:id', authenticate, albumCtrl.deleteAlbum);

// Media in album routes
router.post('/:albumId/media/upload', authenticate, upload.single('file'), mediaCtrl.uploadToAlbum);
router.post('/:albumId/media/text', authenticate, mediaCtrl.createTextMedia);
router.get('/:albumId/media', authenticate, mediaCtrl.getAlbumMedia);

module.exports = router;
