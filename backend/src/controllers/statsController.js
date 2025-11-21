const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('../models/user');
const Payment = require('../models/payment');

exports.getStats = async (req, res) => {
  try {
    // Tổng số user
    const totalUsers = await User.count();

    // Số user hôm nay
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const usersToday = await User.count({
      where: {
        createdAt: { [Op.gte]: startOfToday }
      }
    });

    // Thống kê thanh toán
    const paymentsCount = await Payment.count();
    const totalPaymentsAmount = await Payment.sum('amount', {
      where: { status: 'completed' }
    }) || 0;

    res.json({
      totalUsers,
      usersToday,
      paymentsCount,
      totalPaymentsAmount
    });
  } catch (err) {
    console.error('getStats error', err);
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

// Lấy danh sách payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{ 
        model: User, 
        as: 'user',
        attributes: ['id', 'email', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.json(payments);
  } catch (err) {
    console.error('getPayments error', err);
    res.status(500).json({ message: 'Error fetching payments', error: err.message });
  }
};

// Lấy danh sách users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'balance', 'isAdmin', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.json(users);
  } catch (err) {
    console.error('getUsers error', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};
