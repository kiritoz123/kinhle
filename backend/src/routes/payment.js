const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const payment = require('../controllers/paymentController');

// Tạo link thanh toán
router.post('/create', authenticate, payment.createPaymentLink);

// Lấy thông tin thanh toán
router.get('/info/:id', authenticate, payment.getPaymentInfo);

// Hủy thanh toán
router.post('/cancel/:id', authenticate, payment.cancelPaymentLink);

// Webhook callback (không cần auth)
router.post('/callback', payment.paymentCallback);

module.exports = router;
