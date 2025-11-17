// backend/src/controllers/uploadController.js
const path = require('path');
const fs = require('fs');

const uploadsBase = path.join(__dirname, '..', '..', 'uploads');

const uploadSuccess = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const userId = String(req.user.id || req.user.userId || req.user.sub || 'unknown');
  const filename = req.file.filename;
  const fileUrl = `https://wibu.tokyo/kinhle/uploads/${userId}/${filename}`;

  return res.status(201).json({
    message: 'File uploaded',
    file: {
      filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
    },
  });
};

const listFiles = (req, res) => {
  const userId = String(req.user.id || req.user.userId || req.user.sub || 'unknown');
  const dir = path.join(uploadsBase, userId);

  if (!fs.existsSync(dir)) {
    return res.json({ files: [] });
  }

  const files = fs.readdirSync(dir).map((fname) => {
    const fullPath = path.join(dir, fname);
    const stat = fs.statSync(fullPath);
    return {
      filename: fname,
      size: stat.size,
      uploadedAt: stat.mtime,
      url: `${req.protocol}://${req.get('host')}/uploads/${userId}/${encodeURIComponent(fname)}`,
    };
  });

  return res.json({ files });
};

const downloadFile = (req, res) => {
  const userId = String(req.user.id || req.user.userId || req.user.sub || 'unknown');
  const { filename } = req.params;

  // Prevent path traversal
  if (filename.includes('..')) {
    return res.status(400).json({ message: 'Invalid filename' });
  }

  const filePath = path.join(uploadsBase, userId, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  return res.sendFile(path.resolve(filePath));
};

module.exports = {
  uploadSuccess,
  listFiles,
  downloadFile,
};
