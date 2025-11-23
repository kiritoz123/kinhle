const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Practice extends Model {}
Practice.init({
  title: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Tên hướng dẫn thực hành'
  },
  content: { 
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Nội dung hướng dẫn chi tiết'
  },
  festivalType: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: 'Loại ngày lễ (VD: "Tết", "Rằm", "Vía", "Tết Trung Thu", etc.)'
  },
  order: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    comment: 'Thứ tự hiển thị'
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
    comment: 'Trạng thái hiển thị'
  }
}, {
  sequelize,
  modelName: 'Practice',
  timestamps: true
});

module.exports = Practice;
