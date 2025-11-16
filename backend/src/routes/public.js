const express = require('express');
const router = express.Router();
const publicCtrl = require('../controllers/publicController');
const { authenticate } = require('../middleware/auth');

// Public read endpointss
router.get('/banners', publicCtrl.getBanners);
router.get('/festivals', publicCtrl.getFestivals);
router.get('/festivals/:id', publicCtrl.getFestivalById);
router.get('/prayers/templates', publicCtrl.getPrayerTemplates);
router.get('/masters', publicCtrl.getMasters);
router.get('/blogs', publicCtrl.listBlogs);

// Purchase (requires auth)
router.post('/prayers/purchase', authenticate, publicCtrl.purchaseTemplate);

// Optional: save checklist (requires auth)
router.post('/checklist/save', authenticate, publicCtrl.saveChecklist);

module.exports = router;
