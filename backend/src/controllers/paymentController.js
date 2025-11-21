const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/payment');

// PayOS Config từ .env
const PAYOS_CLIENT_ID = "f675ac92-69e3-48a8-9e2b-74f3f36ae76f";
const PAYOS_API_KEY = "69750660-6158-4c8c-8c44-5894058e02c3";
const PAYOS_CHECKSUM_KEY = "20b1b2256df9d7c01363417acf0aa47ef4285dfd927cf21d9fb10c9c0d031787";
const PAYOS_BASE_URL = "https://api-merchant.payos.vn/v2/payment-requests";

const RETURN_URL = process.env.PAYOS_RETURN_URL || "http://localhost:3000/payment/success";
const CANCEL_URL = process.env.PAYOS_CANCEL_URL || "http://localhost:3000/payment/cancel";

// Tạo signature
function createSignature({ amount, cancelUrl, description, orderCode, returnUrl }) {
  const rawData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  return crypto.createHmac("sha256", PAYOS_CHECKSUM_KEY).update(rawData).digest("hex");
}

// 1. Tạo link thanh toán
exports.createPaymentLink = async (req, res) => {
  try {
    const { orderCode, amount, description, buyerName } = req.body;

    if (!orderCode || !amount || !description) {
      return res.status(400).json({ 
        error: "Thiếu thông tin (orderCode, amount, description)" 
      });
    }

    const signature = createSignature({
      amount,
      cancelUrl: CANCEL_URL,
      description,
      orderCode,
      returnUrl: RETURN_URL,
    });

    const body = {
      orderCode,
      amount,
      description,
      buyerName: buyerName || "Khách hàng",
      cancelUrl: CANCEL_URL,
      returnUrl: RETURN_URL,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
      signature,
    };

    const response = await axios.post(PAYOS_BASE_URL, body, {
      headers: {
        "x-client-id": PAYOS_CLIENT_ID,
        "x-api-key": PAYOS_API_KEY,
        "Content-Type": "application/json",
      },
    });

    // Lưu vào DB để tracking (optional)
    if (req.user) {
      await Payment.create({
        userId: req.user.id,
        amount,
        orderCode,
        description,
        status: 'pending'
      });
    }

    return res.json(response.data);

  } catch (error) {
    console.error("❌ Lỗi tạo link:", error.response?.data || error.message);
    return res.status(500).json({ 
      error: "Không thể tạo link thanh toán", 
      details: error.response?.data 
    });
  }
};

// 2. Lấy thông tin thanh toán
exports.getPaymentInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${PAYOS_BASE_URL}/${id}`, {
      headers: {
        "x-client-id": PAYOS_CLIENT_ID,
        "x-api-key": PAYOS_API_KEY,
      },
    });

    return res.json(response.data);

  } catch (error) {
    console.error("❌ Lỗi lấy info:", error.response?.data || error.message);
    return res.status(500).json({ 
      error: "Không thể lấy thông tin", 
      details: error.response?.data 
    });
  }
};

// 3. Hủy thanh toán
exports.cancelPaymentLink = async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;

  try {
    const response = await axios.post(
      `${PAYOS_BASE_URL}/${id}/cancel`, 
      { cancellationReason: cancellationReason || "Hủy bởi người dùng" }, 
      {
        headers: {
          "x-client-id": PAYOS_CLIENT_ID,
          "x-api-key": PAYOS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Update DB nếu cần
    await Payment.update(
      { status: 'cancelled' },
      { where: { orderCode: id } }
    );

    return res.json(response.data);

  } catch (error) {
    console.error("❌ Lỗi hủy:", error.response?.data || error.message);
    return res.status(500).json({ 
      error: "Không thể hủy", 
      details: error.response?.data 
    });
  }
};
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;

    const payment = await Payment.findOne({ 
      where: { orderCode },
      attributes: ['id', 'orderCode', 'amount', 'status', 'description', 'createdAt', 'updatedAt']
    });

    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy giao dịch" 
      });
    }

    return res.json({
      success: true,
      data: {
        orderCode: payment.orderCode,
        amount: payment.amount,
        status: payment.status, // pending, completed, failed, cancelled
        description: payment.description,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      }
    });

  } catch (error) {
    console.error("❌ Lỗi check status:", error);
    return res.status(500).json({ 
      success: false,
      error: "Không thể kiểm tra trạng thái" 
    });
  }
};

// 4. Webhook callback
exports.paymentCallback = async (req, res) => {
  try {
    console.log("📩 Callback từ PayOS:", JSON.stringify(req.body, null, 2));
    
    const { code, desc, data } = req.body;

    if (!data) {
      console.error("❌ Webhook thiếu data");
      return res.status(200).json({ success: false, message: "Missing data" });
    }

    const { 
      orderCode, 
      amount, 
      description,
      accountNumber,
      reference,
      transactionDateTime,
      paymentLinkId,
      counterAccountBankName,
      counterAccountName,
      counterAccountNumber
    } = data;

    // code === "00" nghĩa là giao dịch thành công
    if (code === "00") {
      // Tìm payment trong DB
      const payment = await Payment.findOne({ 
        where: { orderCode: String(orderCode) },
        include: [{ model: require('../models/user'), as: 'user' }]
      });
      
      if (payment) {
        // Cập nhật trạng thái payment
        await payment.update({
          status: 'completed',
          method: 'PayOS',
          description: description || payment.description
        });
        
        // Cộng tiền vào tài khoản user
        if (payment.userId) {
          const User = require('../models/user');
          await User.increment('balance', { 
            by: amount, 
            where: { id: payment.userId } 
          });
          
          console.log(`💰 Đã cộng ${amount} VNĐ vào tài khoản user ID: ${payment.userId}`);
        }
        
        console.log(`✅ Thanh toán thành công:
          - Order: ${orderCode}
          - Số tiền: ${amount} VNĐ
          - Người thanh toán: ${counterAccountName || 'N/A'}
          - Ngân hàng: ${counterAccountBankName || 'N/A'}
          - Thời gian: ${transactionDateTime}
        `);
      } else {
        console.warn(`⚠️ Không tìm thấy payment với orderCode: ${orderCode}`);
      }
    } else {
      // Giao dịch thất bại
      console.log(`❌ Giao dịch thất bại - Code: ${code}, Desc: ${desc}`);
      
      const payment = await Payment.findOne({ where: { orderCode: String(orderCode) } });
      if (payment) {
        await payment.update({ status: 'failed' });
      }
    }

    // Luôn trả về 200 để PayOS biết đã nhận webhook
    return res.status(200).json({ 
      success: true,
      message: "Webhook received" 
    });

  } catch (error) {
    console.error("❌ Lỗi xử lý callback:", error.message);
    console.error(error.stack);
    
    // Vẫn trả 200 để tránh PayOS retry liên tục
    return res.status(200).json({ 
      success: false,
      error: error.message 
    });
  }
};
