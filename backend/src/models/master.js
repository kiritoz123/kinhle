const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Master extends Model {}
Master.init({
  name: { type: DataTypes.STRING, allowNull: false },
  experience: { type: DataTypes.STRING }, // e.g. "20 năm"
  specialty: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  photo: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Master',
  tableName: 'Masters',
  timestamps: true
});

module.exports = Master;