const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class FamilyTree extends Model {}
FamilyTree.init({
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID người tạo cây gia phả'
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Tên cây gia phả (VD: "Gia đình Nguyễn")'
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả gia phả'
  },
  isPrivate: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true,
    comment: 'Gia phả riêng tư hay công khai'
  }
}, {
  sequelize,
  modelName: 'FamilyTree',
  timestamps: true
});

module.exports = FamilyTree;
