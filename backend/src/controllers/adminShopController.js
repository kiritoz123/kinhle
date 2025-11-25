const Shop = require('../models/shop');
const Product = require('../models/product');
const User = require('../models/user');

// ============= ADMIN SHOP MANAGEMENT =============

// Lấy tất cả shops (bao gồm pending, rejected)
exports.getAllShops = async (req, res) => {
  try {
    const { status } = req.query; // Filter: pending, approved, rejected
    const where = {};
    if (status) where.status = status;
    
    const shops = await Shop.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết shop (admin)
exports.getShopDetail = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Product,
          as: 'products'
        }
      ]
    });
    
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin tạo shop mới (không cần pending)
exports.createShop = async (req, res) => {
  try {
    const { userId, name, description, owner, phone, address, logo, rating, status, isActive } = req.body;
    
    // Kiểm tra name là bắt buộc
    if (!name) {
      return res.status(400).json({ error: 'Tên shop là bắt buộc' });
    }
    
    // Nếu có userId, kiểm tra user tồn tại
    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    const shop = await Shop.create({
      userId: userId || null, // userId có thể null nếu admin tạo shop hệ thống
      name,
      description,
      owner,
      phone,
      address,
      logo,
      rating: rating || 5.0,
      status: status || 'approved', // Admin tạo mặc định approved
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.json({ message: 'Tạo shop thành công', shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin cập nhật shop
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    await shop.update(req.body);
    res.json({ message: 'Cập nhật shop thành công', shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin xóa shop
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    // Xóa tất cả products của shop
    await Product.destroy({ where: { shopId: shop.id } });
    
    await shop.destroy();
    res.json({ message: 'Đã xóa shop' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PHÊ DUYỆT SHOP
exports.approveShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body; // status: 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status phải là "approved" hoặc "rejected"' });
    }
    
    const shop = await Shop.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    await shop.update({ status });
    
    // TODO: Gửi email thông báo cho user về kết quả phê duyệt
    
    res.json({ 
      message: `Shop đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'}`,
      shop 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách shops đang chờ duyệt
exports.getPendingShops = async (req, res) => {
  try {
    const shops = await Shop.findAll({
      where: { status: 'pending' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      order: [['createdAt', 'ASC']]
    });
    
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thống kê shops
exports.getShopStats = async (req, res) => {
  try {
    const totalShops = await Shop.count();
    const pendingShops = await Shop.count({ where: { status: 'pending' } });
    const approvedShops = await Shop.count({ where: { status: 'approved' } });
    const rejectedShops = await Shop.count({ where: { status: 'rejected' } });
    const activeShops = await Shop.count({ where: { isActive: true, status: 'approved' } });
    
    res.json({
      total: totalShops,
      pending: pendingShops,
      approved: approvedShops,
      rejected: rejectedShops,
      active: activeShops
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
