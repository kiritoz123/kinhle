const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const { sequelize } = require('./config/db');
const User = require('./models/user');
require('./models/payment');
require('./models/festival');
require('./models/blog');
require('./models/prayer');
require('./models/banner');
require('./models/master');
require('./models/savedPrayer');
require('./models/practice');
require('./models/item');
const Shop = require('./models/shop');
const Product = require('./models/product');
const Album = require('./models/album');
const Media = require('./models/media');
const FamilyTree = require('./models/familyTree');
const FamilyMember = require('./models/familyMember');
const userRoutes = require('./routes/user');

// Thiết lập relationships
User.hasOne(Shop, { as: 'shop', foreignKey: 'userId' });
Shop.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Shop.hasMany(Product, { as: 'products', foreignKey: 'shopId' });
Product.belongsTo(Shop, { as: 'shop', foreignKey: 'shopId' });

// Album & Media relationships
User.hasMany(Album, { as: 'albums', foreignKey: 'userId' });
Album.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Album.hasMany(Media, { as: 'media', foreignKey: 'albumId' });
Media.belongsTo(Album, { as: 'album', foreignKey: 'albumId' });

// FamilyTree & Member relationships
User.hasMany(FamilyTree, { as: 'familyTrees', foreignKey: 'userId' });
FamilyTree.belongsTo(User, { as: 'user', foreignKey: 'userId' });
FamilyTree.hasMany(FamilyMember, { as: 'members', foreignKey: 'familyTreeId' });
FamilyMember.belongsTo(FamilyTree, { as: 'familyTree', foreignKey: 'familyTreeId' });
FamilyMember.hasMany(Media, { as: 'media', foreignKey: 'familyMemberId' });
Media.belongsTo(FamilyMember, { as: 'familyMember', foreignKey: 'familyMemberId' });

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
// new upload/user routes
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payment');
const albumRoutes = require('./routes/album');
const familyTreeRoutes = require('./routes/familyTree');
const mediaRoutes = require('./routes/media');

const app = express();
app.use(cors());
app.use(express.json());

// mount existing routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/family-trees', familyTreeRoutes);
app.use('/api/media', mediaRoutes);
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
