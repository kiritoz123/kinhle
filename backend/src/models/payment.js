const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');

class Payment extends Model {}
Payment.init({
  amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: 'VND' },
  method: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'completed' }
}, {
  sequelize,
  modelName: 'Payment',
  timestamps: true
});

Payment.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Payment, { as: 'payments', foreignKey: 'userId' });

module.exports = Payment;
