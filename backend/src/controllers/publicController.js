// Public read endpoints + purchase template
const Banner = require('../models/banner');
const Festival = require('../models/festival');
const Prayer = require('../models/prayer');
const Master = require('../models/master');
const Payment = require('../models/payment');
const User = require('../models/user');
const SavedPrayer = require('../models/savedPrayer');

// GET /api/public/banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({ order: [['order', 'ASC'], ['createdAt', 'DESC']] });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching banners', error: err.message });
  }
};

// GET /api/public/festivals
exports.getFestivals = async (req, res) => {
  try {
    const festivals = await Festival.findAll({ order: [['date', 'ASC']] });
    res.json(festivals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching festivals', error: err.message });
  }
};

// GET /api/public/festivals/:id
exports.getFestivalById = async (req, res) => {
  try {
    const f = await Festival.findByPk(req.params.id);
    if (!f) return res.status(404).json({ message: 'Not found' });
    res.json(f);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching festival', error: err.message });
  }
};

// GET /api/public/prayers/templates
exports.getPrayerTemplates = async (req, res) => {
  try {
    const templates = await Prayer.findAll({ where: { isTemplate: true }, order: [['createdAt', 'DESC']] });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching templates', error: err.message });
  }
};

// GET /api/public/masters
exports.getMasters = async (req, res) => {
  try {
    const masters = await Master.findAll({ order: [['createdAt', 'DESC']] });
    res.json(masters);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching masters', error: err.message });
  }
};

// POST /api/public/prayers/purchase  (requires authenticate middleware)
exports.purchaseTemplate = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { templateId } = req.body;
    if (!templateId) return res.status(400).json({ message: 'templateId required' });

    const template = await Prayer.findByPk(templateId);
    if (!template || !template.isTemplate) return res.status(404).json({ message: 'Template not found' });

    const price = Number(template.price || 0);
    if (price > 0) {
      if (user.walletBalance < price) return res.status(400).json({ message: 'Insufficient balance' });

      await Payment.create({
        userId: user.id,
        amount: price,
        currency: 'COIN',
        method: 'wallet',
        status: 'completed'
      });

      user.walletBalance = Number(user.walletBalance) - price;
      await user.save();
    }

    const existing = await SavedPrayer.findOne({ where: { userId: user.id, prayerId: template.id } });
    if (!existing) {
      await SavedPrayer.create({ userId: user.id, prayerId: template.id });
    }

    const savedRows = await SavedPrayer.findAll({ where: { userId: user.id }, include: [{ model: Prayer, as: 'prayer' }] });
    const saved = savedRows.map(s => ({ id: s.prayer.id, title: s.prayer.title, content: s.prayer.content }));

    res.json({ balance: user.walletBalance, saved });
  } catch (err) {
    console.error('purchaseTemplate error', err);
    res.status(500).json({ message: 'Error purchasing template', error: err.message });
  }
};

// Optional: save checklist per user (if needed)
exports.saveChecklist = async (req, res) => {
  try {
    const user = req.user;
    const { checklist } = req.body;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    // For production persist checklist: add JSON column to User or a separate model
    user.checklist = JSON.stringify(checklist);
    await user.save().catch(() => {});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Error saving checklist', error: err.message });
  }
};