'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('../models/Admin');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email    = process.env.ADMIN_EMAIL    || 'dreyesdelicias@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'DReyesAdmin2026!';

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`Admin already exists: ${email}`);
      process.exit(0);
    }

    const admin = new Admin({ email, password });
    await admin.save();

    console.log('Admin created successfully');
    console.log(`  Email   : ${email}`);
    console.log(`  Password: ${password}`);
    console.log('\n⚠  Change the password after first login.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seedAdmin();
