const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const { sequelize } = require('./config/db');
require('./models/user');
require('./models/payment');
require('./models/festival');
require('./models/blog');
require('./models/prayer');
require('./models/banner');
require('./models/master');
require('./models/savedPrayer');
require('./models/practice');
require('./models/item');
const userRoutes = require('./routes/user');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
// new upload/user routes
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payment');

const app = express();
app.use(cors());
app.use(express.json());

// mount existing routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);
app.get('/', (req, res) => res.send('Worship app backend (MySQL) running'));

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
