// scripts/seed.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// Define User Schema for seeding
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdminUser() {
  try {
    // Check if MongoDB URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Define admin credentials from env or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create the admin user
    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      isAdmin: true,
    });

    await adminUser.save();
    console.log(`Admin user created: ${adminEmail}`);

    // Create a demo question if needed
    const QuestionSchema = new mongoose.Schema(
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        hint: { type: String },
        publishDate: { type: Date, required: true, index: true },
        active: { type: Boolean, default: true },
      },
      { timestamps: true }
    );

    const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

    // Check if there are any questions
    const questionCount = await Question.countDocuments();
    
    if (questionCount === 0) {
      // Create a demo question
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const demoQuestion = new Question({
        question: 'What is the capital of France?',
        answer: 'Paris',
        hint: 'It starts with the letter P',
        publishDate: today,
        active: true,
      });

      await demoQuestion.save();
      console.log('Demo question created');
    }

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedAdminUser();