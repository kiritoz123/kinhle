// Banner model
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Banner extends Model {}
Banner.init({
  title: { type: DataTypes.STRING },
  subtitle: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  link: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  sequelize,
  modelName: 'Banner',
  timestamps: true
});

module.exports = Banner;