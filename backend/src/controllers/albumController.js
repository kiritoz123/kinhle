const Album = require('../models/album');
const Media = require('../models/media');

// Tạo album mới
exports.createAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, coverImage, isPrivate } = req.body;
    
    const album = await Album.create({
      userId,
      name,
      description,
      coverImage,
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });
    
    res.json({ message: 'Tạo album thành công', album });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách albums của user
exports.getMyAlbums = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const albums = await Album.findAll({
      where: { userId },
      include: [{
        model: Media,
        as: 'media',
        attributes: ['id', 'type', 'url', 'thumbnailUrl', 'title']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết album
exports.getAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const album = await Album.findOne({
      where: { id, userId },
      include: [{
        model: Media,
        as: 'media',
        order: [['createdAt', 'DESC']]
      }]
    });
    
    if (!album) {
      return res.status(404).json({ error: 'Không tìm thấy album' });
    }
    
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật album
exports.updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const album = await Album.findOne({ where: { id, userId } });
    if (!album) {
      return res.status(404).json({ error: 'Không tìm thấy album' });
    }
    
    await album.update(req.body);
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa album
exports.deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const album = await Album.findOne({ where: { id, userId } });
    if (!album) {
      return res.status(404).json({ error: 'Không tìm thấy album' });
    }
    
    // Xóa tất cả media trong album
    await Media.destroy({ where: { albumId: id } });
    
    await album.destroy();
    res.json({ message: 'Đã xóa album' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
