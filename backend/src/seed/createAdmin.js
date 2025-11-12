// backend/src/seedAdmin.js
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const User = require('../models/user');

// Thông tin admin hardcode
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Kiểm tra admin đã tồn tại chưa
    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Hash password
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Tạo admin
    const admin = await User.create({
      email: ADMIN_EMAIL,
      password: hashed,
      name: 'Admin',
      isAdmin: true
    });

    console.log('Admin created:', admin.email);
    process.exit(0);

  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

run();
