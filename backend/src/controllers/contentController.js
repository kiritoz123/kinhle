const Festival = require('../models/festival');
const Blog = require('../models/blog');
const Prayer = require('../models/prayer');
const Banner = require('../models/banner');
const Master = require('../models/master');

exports.createFestival = async (req, res) => {
  try {
    const f = await Festival.create(req.body);
    res.json(f);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateFestival = async (req, res) => {
  try {
    const f = await Festival.findByPk(req.params.id);
    if (!f) return res.status(404).json({ message: 'Not found' });
    await f.update(req.body);
    res.json(f);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteFestival = async (req, res) => {
  try {
    const f = await Festival.findByPk(req.params.id);
    if (!f) return res.status(404).json({ message: 'Not found' });
    await f.destroy();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.listFestivals = async (req, res) => {
  try {
    const list = await Festival.findAll({ order: [['date', 'ASC']] });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Blogs
exports.createBlog = async (req, res) => {
  try {
    const b = await Blog.create(req.body);
    res.json(b);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateBlog = async (req, res) => {
  try {
    const b = await Blog.findByPk(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    await b.update(req.body);
    res.json(b);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteBlog = async (req, res) => {
  try {
    const b = await Blog.findByPk(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    await b.destroy();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.listBlogs = async (req, res) => {
  try {
    const list = await Blog.findAll({ order: [['createdAt', 'DESC']] });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Prayers
exports.createPrayer = async (req, res) => {
  try {
    const p = await Prayer.create(req.body);
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updatePrayer = async (req, res) => {
  try {
    const p = await Prayer.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.update(req.body);
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deletePrayer = async (req, res) => {
  try {
    const p = await Prayer.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.destroy();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.listPrayers = async (req, res) => {
  try {
    const list = await Prayer.findAll({ order: [['createdAt', 'DESC']] });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createBanner = async (req, res) => {
  try {
    const b = await Banner.create(req.body);
    res.json(b);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateBanner = async (req, res) => {
  try {
    const b = await Banner.findByPk(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    await b.update(req.body);
    res.json(b);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteBanner = async (req, res) => {
  try {
    const b = await Banner.findByPk(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    await b.destroy();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.listBanners = async (req, res) => {
  try {
    const list = await Banner.findAll({ order: [['order', 'ASC'], ['createdAt','DESC']] });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Masters CRUD
exports.createMaster = async (req, res) => {
  try {
    const m = await Master.create(req.body);
    res.json(m);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateMaster = async (req, res) => {
  try {
    const m = await Master.findByPk(req.params.id);
    if (!m) return res.status(404).json({ message: 'Not found' });
    await m.update(req.body);
    res.json(m);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteMaster = async (req, res) => {
  try {
    const m = await Master.findByPk(req.params.id);
    if (!m) return res.status(404).json({ message: 'Not found' });
    await m.destroy();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.listMasters = async (req, res) => {
  try {
    const list = await Master.findAll({ order: [['createdAt','DESC']] });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

