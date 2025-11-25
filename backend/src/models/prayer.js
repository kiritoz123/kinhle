const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Prayer extends Model {}
Prayer.init({
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  language: { type: DataTypes.STRING, defaultValue: 'vi' },
  imageUrl: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: 'URL ảnh minh họa cho lời khấn'
  },

  // fields for templates / public use
  isTemplate: { type: DataTypes.BOOLEAN, defaultValue: false },
  occasion: { type: DataTypes.STRING, allowNull: true },
  price: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  sequelize,
  modelName: 'Prayer',
  tableName: 'Prayers',
  timestamps: true
});

module.exports = Prayer;