const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Media extends Model {}
Media.init({
  albumId: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID album (nếu thuộc album)'
  },
  familyMemberId: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID thành viên gia phả (nếu thuộc gia phả)'
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID người upload'
  },
  type: { 
    type: DataTypes.ENUM('image', 'audio', 'video', 'text'),
    allowNull: false,
    comment: 'Loại media'
  },
  title: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Tiêu đề'
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả'
  },
  url: { 
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL file trên Cloudinary'
  },
  cloudinaryId: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Public ID trên Cloudinary'
  },
  thumbnailUrl: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL thumbnail (cho video/audio)'
  },
  duration: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Thời lượng (giây) cho audio/video'
  },
  fileSize: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Kích thước file (bytes)'
  },
  mimeType: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'MIME type của file'
  },
  textContent: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Nội dung text nếu type="text"'
  }
}, {
  sequelize,
  modelName: 'Media',
  timestamps: true
});

module.exports = Media;
