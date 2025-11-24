const Media = require('../models/media');
const Album = require('../models/album');
const FamilyMember = require('../models/familyMember');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper: Upload file lên Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Upload media vào album
exports.uploadToAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { albumId } = req.params;
    const { title, description } = req.body;
    
    // Kiểm tra album thuộc user
    const album = await Album.findOne({ where: { id: albumId, userId } });
    if (!album) {
      return res.status(404).json({ error: 'Không tìm thấy album' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được upload' });
    }
    
    // Xác định resource_type
    let resourceType = 'auto';
    if (req.file.mimetype.startsWith('image/')) resourceType = 'image';
    else if (req.file.mimetype.startsWith('audio/')) resourceType = 'video'; // Cloudinary dùng 'video' cho audio
    else if (req.file.mimetype.startsWith('video/')) resourceType = 'video';
    
    // Upload lên Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `kinhle/albums/${albumId}`,
      resource_type: resourceType
    });
    
    // Lưu vào database
    const media = await Media.create({
      albumId,
      userId,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 
            req.file.mimetype.startsWith('audio/') ? 'audio' : 'video',
      title,
      description,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      thumbnailUrl: result.thumbnail_url,
      duration: result.duration,
      fileSize: result.bytes,
      mimeType: req.file.mimetype
    });
    
    res.json({ message: 'Upload thành công', media });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload media vào family member
exports.uploadToFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { familyMemberId } = req.params;
    const { title, description } = req.body;
    
    // Kiểm tra family member thuộc user
    const FamilyTree = require('../models/familyTree');
    const member = await FamilyMember.findOne({
      where: { id: familyMemberId },
      include: [{
        model: FamilyTree,
        as: 'familyTree',
        where: { userId }
      }]
    });
    
    if (!member) {
      return res.status(404).json({ error: 'Không tìm thấy thành viên gia phả' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được upload' });
    }
    
    // Xác định resource_type
    let resourceType = 'auto';
    if (req.file.mimetype.startsWith('image/')) resourceType = 'image';
    else if (req.file.mimetype.startsWith('audio/')) resourceType = 'video';
    else if (req.file.mimetype.startsWith('video/')) resourceType = 'video';
    
    // Upload lên Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `kinhle/family/${familyMemberId}`,
      resource_type: resourceType
    });
    
    // Lưu vào database
    const media = await Media.create({
      familyMemberId,
      userId,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 
            req.file.mimetype.startsWith('audio/') ? 'audio' : 'video',
      title,
      description,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      thumbnailUrl: result.thumbnail_url,
      duration: result.duration,
      fileSize: result.bytes,
      mimeType: req.file.mimetype
    });
    
    res.json({ message: 'Upload thành công', media });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo text media (ghi chú văn bản)
exports.createTextMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { albumId, familyMemberId, title, textContent } = req.body;
    
    if (!textContent) {
      return res.status(400).json({ error: 'Nội dung text không được để trống' });
    }
    
    // Kiểm tra quyền sở hữu
    if (albumId) {
      const album = await Album.findOne({ where: { id: albumId, userId } });
      if (!album) {
        return res.status(404).json({ error: 'Không tìm thấy album' });
      }
    }
    
    if (familyMemberId) {
      const FamilyTree = require('../models/familyTree');
      const member = await FamilyMember.findOne({
        where: { id: familyMemberId },
        include: [{
          model: FamilyTree,
          as: 'familyTree',
          where: { userId }
        }]
      });
      if (!member) {
        return res.status(404).json({ error: 'Không tìm thấy thành viên gia phả' });
      }
    }
    
    const media = await Media.create({
      albumId: albumId || null,
      familyMemberId: familyMemberId || null,
      userId,
      type: 'text',
      title,
      textContent,
      url: '' // Text không cần URL
    });
    
    res.json({ message: 'Tạo ghi chú thành công', media });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy media của album
exports.getAlbumMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { albumId } = req.params;
    const { type } = req.query; // Filter by type: image, audio, video, text
    
    const album = await Album.findOne({ where: { id: albumId, userId } });
    if (!album) {
      return res.status(404).json({ error: 'Không tìm thấy album' });
    }
    
    const where = { albumId };
    if (type) where.type = type;
    
    const media = await Media.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy media của family member
exports.getFamilyMemberMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { familyMemberId } = req.params;
    const { type } = req.query;
    
    const FamilyTree = require('../models/familyTree');
    const member = await FamilyMember.findOne({
      where: { id: familyMemberId },
      include: [{
        model: FamilyTree,
        as: 'familyTree',
        where: { userId }
      }]
    });
    
    if (!member) {
      return res.status(404).json({ error: 'Không tìm thấy thành viên gia phả' });
    }
    
    const where = { familyMemberId };
    if (type) where.type = type;
    
    const media = await Media.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật media
exports.updateMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const media = await Media.findOne({ where: { id, userId } });
    if (!media) {
      return res.status(404).json({ error: 'Không tìm thấy media' });
    }
    
    await media.update(req.body);
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa media
exports.deleteMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const media = await Media.findOne({ where: { id, userId } });
    if (!media) {
      return res.status(404).json({ error: 'Không tìm thấy media' });
    }
    
    // Xóa file trên Cloudinary nếu có
    if (media.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(media.cloudinaryId, {
          resource_type: media.type === 'image' ? 'image' : 'video'
        });
      } catch (err) {
        console.error('Error deleting from Cloudinary:', err);
      }
    }
    
    await media.destroy();
    res.json({ message: 'Đã xóa media' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
