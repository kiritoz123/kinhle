const User = require('../models/user');
const Payment = require('../models/payment');
const { Op } = require('sequelize');

/**
 * Trừ tiền từ tài khoản user
 * POST /api/user/deduct-coins
 */
exports.deductCoins = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.id;

    // Validate
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Số tiền không hợp lệ' 
      });
    }

    // Lấy user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User không tồn tại' 
      });
    }

    // Kiểm tra số dư
    if (user.balance < amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Số dư không đủ',
        currentBalance: user.balance,
        required: amount
      });
    }

    // Trừ tiền
    await User.decrement('balance', { 
      by: amount, 
      where: { id: userId } 
    });

    // Lưu lịch sử giao dịch (âm = trừ tiền)
    await Payment.create({
      userId,
      amount: -amount, // Số âm để biết là trừ tiền
      currency: 'VND',
      method: 'Deduct',
      status: 'completed',
      orderCode: `DEDUCT-${Date.now()}`,
      description: description || 'Trừ tiền từ tài khoản'
    });

    // Lấy balance mới
    await user.reload();

    return res.json({
      success: true,
      message: 'Trừ tiền thành công',
      data: {
        deducted: amount,
        newBalance: user.balance,
        description
      }
    });

  } catch (error) {
    console.error('❌ Lỗi trừ tiền:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

/**
 * Lấy lịch sử giao dịch của user
 * GET /api/user/transactions
 */
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await Payment.findAndCountAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'amount', 'currency', 'method', 'status', 'orderCode', 'description', 'createdAt', 'updatedAt']
    });

    return res.json({
      success: true,
      data: {
        total: transactions.count,
        transactions: transactions.rows.map(t => ({
          id: t.id,
          amount: t.amount,
          currency: t.currency,
          method: t.method,
          status: t.status,
          orderCode: t.orderCode,
          description: t.description,
          type: t.amount >= 0 ? 'deposit' : 'deduct', // Phân biệt nạp/trừ tiền
          createdAt: t.createdAt,
          updatedAt: t.updatedAt
        }))
      }
    });

  } catch (error) {
    console.error('❌ Lỗi lấy lịch sử:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

/**
 * Lấy thống kê giao dịch của user
 * GET /api/user/transaction-stats
 */
exports.getTransactionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'balance']
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User không tồn tại' 
      });
    }

    // Tổng nạp
    const totalDeposit = await Payment.sum('amount', {
      where: { 
        userId,
        status: 'completed',
        amount: { [Op.gt]: 0 } // Chỉ lấy số dương
      }
    }) || 0;

    // Tổng trừ
    const totalDeduct = await Payment.sum('amount', {
      where: { 
        userId,
        status: 'completed',
        amount: { [Op.lt]: 0 } // Chỉ lấy số âm
      }
    }) || 0;

    // Số giao dịch
    const totalTransactions = await Payment.count({
      where: { userId }
    });

    return res.json({
      success: true,
      data: {
        currentBalance: user.balance,
        totalDeposit,
        totalDeduct: Math.abs(totalDeduct),
        totalTransactions,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    });

  } catch (error) {
    console.error('❌ Lỗi lấy stats:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};
