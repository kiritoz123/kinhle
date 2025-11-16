// backend/src/routes/uploads.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth'); // dùng middleware bạn cung cấp
const uploadController = require('../controllers/uploadController');

const router = express.Router();

const uploadsBase = path.join(__dirname, '..', '..', 'uploads');

// Multer storage: save to uploads/<userId>/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // req.user là Sequelize User instance từ middleware authenticate
    const userId = String(req.user && (req.user.id || req.user.userId));
    const dir = path.join(uploadsBase, userId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  },
});

// Accept only images and audio
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and audio files are allowed'), false);
  }
};

// limits: adjust max file size (bytes)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post('/upload', authenticate, upload.single('file'), uploadController.uploadSuccess);
router.get('/files', authenticate, uploadController.listFiles);
router.get('/files/:filename', authenticate, uploadController.downloadFile);

module.exports = router;
