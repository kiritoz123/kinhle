const Shop = require('../models/shop');
const Product = require('../models/product');

// ============= SHOPS CRUD =============
exports.createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listShops = async (req, res) => {
  try {
    const shops = await Shop.findAll({
      where: { 
        status: 'approved',
        isActive: true 
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShop = async (req, res) => {
  try {
    const User = require('../models/user');
    const shop = await Shop.findByPk(req.params.id, {
      include: [
        { 
          model: Product, 
          as: 'products',
          where: { isAvailable: true },
          required: false
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    
    await shop.update(req.body);
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    
    await shop.destroy();
    res.json({ message: 'Shop deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============= PRODUCTS CRUD =============
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const { shopId, category } = req.query;
    const where = {};
    if (shopId) where.shopId = shopId;
    if (category) where.category = category;
    
    const products = await Product.findAll({
      where,
      include: [{ 
        model: Shop, 
        as: 'shop',
        attributes: ['id', 'name', 'logo', 'rating']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ 
        model: Shop, 
        as: 'shop'
      }]
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
