// backend/src/db.js
const { Sequelize } = require('sequelize');

// Cấu hình cứng kết nối MySQL trong Docker Compose
const sequelize = new Sequelize('worship_app', 'worship_user', 'worship_pass', {
  host: 'mysql',  // tên service MySQL trong docker-compose
  port: 3306,     // port bên trong container MySQL
  dialect: 'mysql',
  logging: false  // tắt log query
});

// Test kết nối
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to MySQL:', err);
  });

module.exports = { sequelize, Sequelize };
