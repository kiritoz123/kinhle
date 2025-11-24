const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class FamilyMember extends Model {}
FamilyMember.init({
  familyTreeId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID cây gia phả'
  },
  parentId: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID cha/mẹ (null nếu là gốc)'
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: 'Tên thành viên'
  },
  gender: { 
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
    comment: 'Giới tính'
  },
  birthDate: { 
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ngày sinh'
  },
  deathDate: { 
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ngày mất'
  },
  avatar: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Ảnh đại diện'
  },
  biography: { 
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Tiểu sử'
  },
  relationship: { 
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Mối quan hệ (Ông, Bà, Cha, Mẹ, Con, etc.)'
  },
  generation: { 
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Thế hệ thứ mấy'
  }
}, {
  sequelize,
  modelName: 'FamilyMember',
  timestamps: true
});

module.exports = FamilyMember;
