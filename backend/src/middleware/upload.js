const multer = require('multer');
const path = require('path');

// Cấu hình multer để upload vào memory
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedImages = /jpeg|jpg|png|gif|webp/;
  const allowedAudio = /mp3|wav|ogg|m4a|aac/;
  const allowedVideo = /mp4|avi|mov|wmv|flv/;
  
  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = file.mimetype;
  
  if (
    (mimetype.startsWith('image/') && allowedImages.test(extname)) ||
    (mimetype.startsWith('audio/') && allowedAudio.test(extname)) ||
    (mimetype.startsWith('video/') && allowedVideo.test(extname))
  ) {
    cb(null, true);
  } else {
    cb(new Error('File không được hỗ trợ. Chỉ chấp nhận ảnh, audio và video.'), false);
  }
};

// Limits
const limits = {
  fileSize: 50 * 1024 * 1024 // 50MB
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;
