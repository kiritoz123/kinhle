const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class User extends Model {}
User.init({
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 } // Số dư tài khoản (VNĐ)
}, {
  sequelize,
  modelName: 'User',
  timestamps: true
});

module.exports = User;
