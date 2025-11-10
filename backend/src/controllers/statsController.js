const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('../models/user');

exports.getStats = async (req, res) => {
  try {
    // Tổng số user
    const totalUsers = await User.count();

    // Số user trong 7 ngày gần nhất (theo createdAt)
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }

    const daily = [];
    for (let i = 0; i < days.length; i++) {
      const start = days[i];
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      const count = await User.count({
        where: {
          createdAt: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
        },
      });
      daily.push({
        date: start.toISOString().slice(0, 10), // YYYY-MM-DD
        count,
      });
    }

    res.json({
      totalUsers,
      daily,
    });
  } catch (err) {
    console.error('getStats error', err);
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};