// SavedPrayer linking table: user <-> prayer
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user');
const Prayer = require('./prayer');

class SavedPrayer extends Model {}
SavedPrayer.init({
  // no extra fields for now
}, {
  sequelize,
  modelName: 'SavedPrayer',
  timestamps: true
});

SavedPrayer.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(SavedPrayer, { as: 'savedPrayers', foreignKey: 'userId' });

SavedPrayer.belongsTo(Prayer, { as: 'prayer', foreignKey: 'prayerId' });
Prayer.hasMany(SavedPrayer, { as: 'savedBy', foreignKey: 'prayerId' });

module.exports = SavedPrayer;