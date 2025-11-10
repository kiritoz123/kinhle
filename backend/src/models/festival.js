const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Festival extends Model {}
Festival.init({
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  // URL ảnh hiển thị trong app / banner
  image: { type: DataTypes.STRING, allowNull: true },
  // Mô tả / nội dung
  description: { type: DataTypes.TEXT },
  // Lịch âm (ví dụ: "1/1 ÂL" hoặc "15/7 ÂL")
  lunarDate: { type: DataTypes.STRING, allowNull: true },
  // Dữ liệu bổ sung nếu cần (JSON)
  metadata: { type: DataTypes.JSON }
}, {
  sequelize,
  modelName: 'Festival',
  timestamps: true
});

module.exports = Festival;