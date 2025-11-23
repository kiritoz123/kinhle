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

// Lấy danh sách payments với phân trang và filter theo ngày
exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    // Filter theo ngày nếu có
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        where.createdAt[Op.gte] = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [{ 
        model: User, 
        as: 'user',
        attributes: ['id', 'email', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      payments: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
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
