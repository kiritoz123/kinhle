const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Product extends Model {}
Product.init({
  shopId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID của shop'
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Tên sản phẩm'
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả sản phẩm'
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Giá sản phẩm'
  },
  image: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL hình ảnh'
  },
  category: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Danh mục (Hương, Hoa quả, Bánh kẹo, Dụng cụ, etc.)'
  },
  stock: { 
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Số lượng tồn kho'
  },
  isAvailable: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
    comment: 'Còn hàng hay không'
  }
}, {
  sequelize,
  modelName: 'Product',
  timestamps: true
});

module.exports = Product;
