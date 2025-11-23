const Practice = require('../models/practice');
const Item = require('../models/item');

// ============= PRACTICES CRUD =============
exports.createPractice = async (req, res) => {
  try {
    const practice = await Practice.create(req.body);
    res.json(practice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listPractices = async (req, res) => {
  try {
    const { festivalType } = req.query;
    const where = {};
    if (festivalType) where.festivalType = festivalType;
    
    const practices = await Practice.findAll({
      where,
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(practices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePractice = async (req, res) => {
  try {
    const practice = await Practice.findByPk(req.params.id);
    if (!practice) return res.status(404).json({ error: 'Practice not found' });
    
    await practice.update(req.body);
    res.json(practice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePractice = async (req, res) => {
  try {
    const practice = await Practice.findByPk(req.params.id);
    if (!practice) return res.status(404).json({ error: 'Practice not found' });
    
    await practice.destroy();
    res.json({ message: 'Practice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============= ITEMS CRUD =============
exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listItems = async (req, res) => {
  try {
    const { festivalType } = req.query;
    const where = {};
    if (festivalType) where.festivalType = festivalType;
    
    const items = await Item.findAll({
      where,
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
