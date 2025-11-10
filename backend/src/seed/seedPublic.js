const dotenv = require('dotenv');
dotenv.config();
const { sequelize } = require('../config/db');

const Banner = require('../models/banner');
const Master = require('../models/master');
const Prayer = require('../models/prayer');
const Festival = require('../models/festival');

async function safeFindOrCreate(Model, where, defaults, label) {
  try {
    console.log(`→ findOrCreate ${label}:`, where);
    const [instance, created] = await Model.findOrCreate({ where, defaults });
    console.log(`  => ${label} done. created=${created} id=${instance && instance.id}`);
    return instance;
  } catch (err) {
    console.error(`  !! Error creating ${label}:`, err && err.message ? err.message : err);
    return null;
  }
}

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected, syncing models (alter=true).');
    await sequelize.sync({ alter: true });

    // Banners
    const banners = [
      { title: 'Chúc mừng năm mới 2025', subtitle: 'An khang thịnh vượng', image: 'https://images.unsplash.com/photo-1542736667-069246bdbc76?q=80&w=1200', order: 1 },
      { title: 'Vu Lan - Lễ báo hiếu', subtitle: 'Báo hiếu tổ tiên', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200', order: 2 },
    ];
    for (const b of banners) {
      await safeFindOrCreate(Banner, { title: b.title }, b, `Banner(${b.title})`);
    }

    // Masters
    const masters = [
      { name: 'Thầy Minh', experience: '20 năm', specialty: 'Lễ Tết, Cúng giỗ', phone: '0987123456' },
      { name: 'Thầy Tuấn', experience: '15 năm', specialty: 'Khai trương, Nhập trạch', phone: '0912345678' },
    ];
    for (const m of masters) {
      await safeFindOrCreate(Master, { name: m.name }, m, `Master(${m.name})`);
    }

    // Festivals with image + lunarDate
    const festivals = [
      { title: 'Tết Nguyên Đán', date: new Date(), lunarDate: '1/1 ÂL', image: 'https://example.com/tet.jpg', description: 'Tết là ngày...' },
      { title: 'Vu Lan', date: new Date(), lunarDate: '15/7 ÂL', image: 'https://example.com/vulan.jpg', description: 'Vu Lan là ngày...' },
    ];
    for (const f of festivals) {
      await safeFindOrCreate(Festival, { title: f.title }, f, `Festival(${f.title})`);
    }

    // Prayer templates
    const templates = [
      { title: 'Lời khấn Tết chuẩn', content: 'Nội dung lời khấn Tết...', isTemplate: true, occasion: 'Tết Nguyên Đán', price: 10 },
      { title: 'Lời khấn cúng rằm', content: 'Nội dung lời khấn rằm...', isTemplate: true, occasion: 'Rằm', price: 6 },
      { title: 'Lời khấn khai trương', content: 'Mẫu khai trương...', isTemplate: true, occasion: 'Khai trương', price: 0 },
    ];
    for (const t of templates) {
      await safeFindOrCreate(Prayer, { title: t.title }, t, `Prayer(${t.title})`);
    }

    console.log('Seed public data done');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

run();