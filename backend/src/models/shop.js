const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Shop extends Model {}
Shop.init({
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID của user sở hữu shop'
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Tên shop'
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả shop'
  },
  owner: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Tên chủ shop'
  },
  phone: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Số điện thoại liên hệ'
  },
  address: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Địa chỉ shop'
  },
  logo: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL logo shop'
  },
  rating: { 
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 5.0,
    comment: 'Đánh giá (1-5 sao)'
  },
  status: { 
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    comment: 'Trạng thái duyệt shop'
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
    comment: 'Trạng thái hoạt động'
  }
}, {
  sequelize,
  modelName: 'Shop',
  timestamps: true
});

module.exports = Shop;
