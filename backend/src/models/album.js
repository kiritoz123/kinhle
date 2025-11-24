const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Album extends Model {}
Album.init({
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID người dùng sở hữu album'
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Tên album/thư mục'
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả album'
  },
  coverImage: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ảnh bìa album'
  },
  isPrivate: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
    comment: 'Album riêng tư hay công khai'
  }
}, {
  sequelize,
  modelName: 'Album',
  timestamps: true
});

module.exports = Album;
