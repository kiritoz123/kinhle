// Run this once to create an admin user from env values
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const User = require('../models/user');

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in env');
      process.exit(1);
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ email, password: hashed, name: 'Admin', isAdmin: true });
    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

run();
