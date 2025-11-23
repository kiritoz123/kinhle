const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const content = require('../controllers/contentController');
const stats = require('../controllers/statsController');
const guide = require('../controllers/guideController');
const shop = require('../controllers/shopController');
const userShop = require('../controllers/userShopController');

// Apply auth + admin to all admin routes
router.use(authenticate, requireAdmin);

// Stats
router.get('/stats', stats.getStats);
router.get('/payments', stats.getPayments);
router.get('/users', stats.getUsers);

// Festivals CRUD
router.post('/festivals', content.createFestival);
router.get('/festivals', content.listFestivals);
router.put('/festivals/:id', content.updateFestival);
router.delete('/festivals/:id', content.deleteFestival);

// Blogs CRUD
router.post('/blogs', content.createBlog);
router.get('/blogs', content.listBlogs);
router.put('/blogs/:id', content.updateBlog);
router.delete('/blogs/:id', content.deleteBlog);

// Prayers CRUD (also used for templates)
router.post('/prayers', content.createPrayer);
router.get('/prayers', content.listPrayers);
router.put('/prayers/:id', content.updatePrayer);
router.delete('/prayers/:id', content.deletePrayer);

// Banners CRUD
router.post('/banners', content.createBanner);
router.get('/banners', content.listBanners);
router.put('/banners/:id', content.updateBanner);
router.delete('/banners/:id', content.deleteBanner);

// Masters CRUD
router.post('/masters', content.createMaster);
router.get('/masters', content.listMasters);
router.put('/masters/:id', content.updateMaster);
router.delete('/masters/:id', content.deleteMaster);

// Practices CRUD
router.post('/practices', guide.createPractice);
router.get('/practices', guide.listPractices);
router.put('/practices/:id', guide.updatePractice);
router.delete('/practices/:id', guide.deletePractice);

// Items CRUD
router.post('/items', guide.createItem);
router.get('/items', guide.listItems);
router.put('/items/:id', guide.updateItem);
router.delete('/items/:id', guide.deleteItem);

// Shops CRUD
router.post('/shops', shop.createShop);
router.get('/shops', shop.listShops);
router.get('/shops/:id', shop.getShop);
router.put('/shops/:id', shop.updateShop);
router.delete('/shops/:id', shop.deleteShop);

// Products CRUD
router.post('/products', shop.createProduct);
router.get('/products', shop.listProducts);
router.get('/products/:id', shop.getProduct);
router.put('/products/:id', shop.updateProduct);
router.delete('/products/:id', shop.deleteProduct);

// Shop Approval
router.put('/shops/:id/approve', userShop.approveShop);

module.exports = router;
