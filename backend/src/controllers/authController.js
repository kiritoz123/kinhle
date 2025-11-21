// authController (add register)
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, "change_this_secret", { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin, walletBalance: user.walletBalance } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'balance', 'isAdmin', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance || 0,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name: name || '', isAdmin: false, walletBalance: 0 });

    const token = jwt.sign({ id: user.id, email: user.email }, "change_this_secret", { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, walletBalance: user.walletBalance } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
