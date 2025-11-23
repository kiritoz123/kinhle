const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');
const userShopController = require('../controllers/userShopController');

// Trừ tiền từ tài khoản
router.post('/deduct-coins', authenticate, userController.deductCoins);

// Lấy lịch sử giao dịch
router.get('/transactions', authenticate, userController.getTransactions);

// Lấy thống kê giao dịch
router.get('/transaction-stats', authenticate, userController.getTransactionStats);

// User Shop Management
router.post('/shop', authenticate, userShopController.createMyShop);
router.get('/shop', authenticate, userShopController.getMyShop);
router.put('/shop', authenticate, userShopController.updateMyShop);

// User Products Management
router.post('/shop/products', authenticate, userShopController.createMyProduct);
router.get('/shop/products', authenticate, userShopController.getMyProducts);
router.put('/shop/products/:id', authenticate, userShopController.updateMyProduct);
router.delete('/shop/products/:id', authenticate, userShopController.deleteMyProduct);

module.exports = router;
