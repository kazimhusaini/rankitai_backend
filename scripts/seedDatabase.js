import dbConnect from '../config/db.js';
import User from '../models/User.js';

dbConnect().then(async () => {
  await User.create({ email: 'admin@example.com', password: 'admin123', role: 'admin' });
  console.log('Database seeded');
  process.exit();
});
