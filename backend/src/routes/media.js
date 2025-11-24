const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const mediaCtrl = require('../controllers/mediaController');

// Media routes (CRUD chung)
router.put('/:id', authenticate, mediaCtrl.updateMedia);
router.delete('/:id', authenticate, mediaCtrl.deleteMedia);

module.exports = router;
