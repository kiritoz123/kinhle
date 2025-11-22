const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Trừ tiền từ tài khoản
router.post('/deduct-coins', authenticate, userController.deductCoins);

// Lấy lịch sử giao dịch
router.get('/transactions', authenticate, userController.getTransactions);

// Lấy thống kê giao dịch
router.get('/transaction-stats', authenticate, userController.getTransactionStats);

module.exports = router;
