const Shop = require('../models/shop');
const Product = require('../models/product');

// User tạo shop mới (cần duyệt)
exports.createMyShop = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Kiểm tra user đã có shop chưa
    const existing = await Shop.findOne({ where: { userId } });
    if (existing) {
      return res.status(400).json({ error: 'Bạn đã có shop rồi' });
    }
    
    const shop = await Shop.create({
      ...req.body,
      userId,
      status: 'pending' // Cần admin duyệt
    });
    
    res.json({ message: 'Tạo shop thành công, đang chờ duyệt', shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy thông tin shop của user
exports.getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ 
      where: { userId: req.user.id },
      include: [{ 
        model: Product, 
        as: 'products'
      }]
    });
    
    if (!shop) {
      return res.status(404).json({ error: 'Bạn chưa có shop' });
    }
    
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật shop của user
exports.updateMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({ error: 'Bạn chưa có shop' });
    }
    
    await shop.update(req.body);
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User thêm sản phẩm vào shop của mình
exports.createMyProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({ error: 'Bạn chưa có shop' });
    }
    
    if (shop.status !== 'approved') {
      return res.status(403).json({ error: 'Shop của bạn chưa được duyệt' });
    }
    
    const product = await Product.create({
      ...req.body,
      shopId: shop.id
    });
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách sản phẩm của shop mình
exports.getMyProducts = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({ error: 'Bạn chưa có shop' });
    }
    
    const products = await Product.findAll({
      where: { shopId: shop.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật sản phẩm của shop mình
exports.updateMyProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({ error: 'Bạn chưa có shop' });
    }
    
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        shopId: shop.id
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa sản phẩm của shop mình
exports.deleteMyProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ where: { userId: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({ error: 'Bạn chưa có shop' });
    }
    
    const product = await Product.findOne({
      where: { 
        id: req.params.id,
        shopId: shop.id
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    
    await product.destroy();
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin duyệt shop
exports.approveShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    
    const { status } = req.body; // 'approved' or 'rejected'
    await shop.update({ status });
    
    res.json({ message: `Shop ${status}`, shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
