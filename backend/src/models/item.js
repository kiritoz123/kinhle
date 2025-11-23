const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Item extends Model {}
Item.init({
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Tên dụng cụ/vật phẩm'
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả chi tiết về dụng cụ'
  },
  festivalType: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: 'Loại ngày lễ (VD: "Tết", "Rằm", "Vía", "Tết Trung Thu", etc.)'
  },
  quantity: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Số lượng gợi ý (VD: "3 bó", "1 chén", "5 quả")'
  },
  isRequired: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
    comment: 'Có bắt buộc không'
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
  modelName: 'Item',
  timestamps: true
});

module.exports = Item;
