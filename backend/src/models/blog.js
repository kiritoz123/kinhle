const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Blog extends Model {}
Blog.init({
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  content: { type: DataTypes.TEXT },
  author: { type: DataTypes.STRING },
  published: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  sequelize,
  modelName: 'Blog',
  timestamps: true
});

module.exports = Blog;
