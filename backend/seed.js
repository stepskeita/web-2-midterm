require('dotenv').config();
const mongoose = require('mongoose');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const User = require('./models/User');
const connectDB = require('./config/db');

// Permission keys
const permissionKeys = ['create', 'edit', 'delete', 'publish', 'view'];

// Role definitions with their permissions
const roleDefinitions = [
  {
    name: 'SuperAdmin',
    permissions: ['create', 'edit', 'delete', 'publish', 'view']
  },
  {
    name: 'Manager',
    permissions: ['create', 'edit', 'publish', 'view']
  },
  {
    name: 'Contributor',
    permissions: ['create', 'edit', 'view']
  },
  {
    name: 'Viewer',
    permissions: ['view']
  }
];

// Test users for each role
const testUsers = [
  {
    fullName: 'Super Admin User',
    email: 'superadmin@test.com',
    password: 'password123',
    roleName: 'SuperAdmin'
  },
  {
    fullName: 'Manager User',
    email: 'manager@test.com',
    password: 'password123',
    roleName: 'Manager'
  },
  {
    fullName: 'Contributor User',
    email: 'contributor@test.com',
    password: 'password123',
    roleName: 'Contributor'
  },
  {
    fullName: 'Viewer User',
    email: 'viewer@test.com',
    password: 'password123',
    roleName: 'Viewer'
  }
];

const seedPermissions = async () => {
  console.log('📋 Seeding Permissions...');

  for (const key of permissionKeys) {
    const existingPermission = await Permission.findOne({ key });

    if (!existingPermission) {
      await Permission.create({ key });
      console.log(`   ✅ Created permission: ${key}`);
    } else {
      console.log(`   ⏭️  Permission already exists: ${key}`);
    }
  }
};

const seedRoles = async () => {
  console.log('\n👥 Seeding Roles...');

  for (const roleDef of roleDefinitions) {
    const existingRole = await Role.findOne({ name: roleDef.name });

    if (!existingRole) {
      // Fetch permission ObjectIds dynamically from database
      const permissions = await Permission.find({
        key: { $in: roleDef.permissions }
      }).select('_id');

      const permissionIds = permissions.map(p => p._id);

      await Role.create({
        name: roleDef.name,
        permissions: permissionIds
      });

      console.log(`   ✅ Created role: ${roleDef.name} with permissions: [${roleDef.permissions.join(', ')}]`);
    } else {
      console.log(`   ⏭️  Role already exists: ${roleDef.name}`);
    }
  }
};

const seedUsers = async () => {
  console.log('\n👤 Seeding Test Users...');

  for (const userData of testUsers) {
    const existingUser = await User.findOne({ email: userData.email });

    if (!existingUser) {
      // Fetch role dynamically from database
      const role = await Role.findOne({ name: userData.roleName });

      if (!role) {
        console.log(`   ❌ Role not found: ${userData.roleName}`);
        continue;
      }

      await User.create({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password, // Will be hashed by pre-save hook
        role: role._id
      });

      console.log(`   ✅ Created user: ${userData.email} (${userData.roleName})`);
    } else {
      console.log(`   ⏭️  User already exists: ${userData.email}`);
    }
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('\n🌱 Starting Database Seeding...\n');
    console.log('='.repeat(50));

    await seedPermissions();
    await seedRoles();
    await seedUsers();

    console.log('\n' + '='.repeat(50));
    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📝 Test User Credentials:');
    console.log('   SuperAdmin: superadmin@test.com / password123');
    console.log('   Manager: manager@test.com / password123');
    console.log('   Contributor: contributor@test.com / password123');
    console.log('   Viewer: viewer@test.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
