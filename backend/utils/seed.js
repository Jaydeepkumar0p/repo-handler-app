/**
 * Seed script — run once to populate demo data
 * Usage: npm run seed   (from backend/ directory)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

if (!process.env.MONGODB_URI) {
  console.error('❌  MONGODB_URI not found — create backend/.env first');
  process.exit(1);
}

// Inline schema avoids model-registration conflicts on re-runs
const schema = new mongoose.Schema(
  {
    name: String, description: String, longDescription: String,
    images: [String], techStack: [String],
    liveUrl: String, githubUrl: String,
    status: { type: String, default: 'Live' },
    order: Number, visitors: Number, featured: Boolean,
  },
  { timestamps: true }
);

const Website = mongoose.model('WebsiteSeed', schema, 'websites');

const DEMO = [
  {
    name: 'Portfolio Showcase',
    description: 'A premium personal website gallery built with the MERN stack, featuring drag-and-drop reordering, Cloudinary image management, and an admin dashboard.',
    longDescription: 'This platform acts as a personal website gallery. Each card represents a live project with 3D tilt effects, smooth animations, an admin panel, and visitor tracking.',
    images: ['https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=1200&h=800&fit=crop'],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'],
    liveUrl: 'https://example.com', githubUrl: 'https://github.com/example/folio',
    status: 'Live', order: 0, visitors: 142, featured: true,
  },
  {
    name: 'E-Commerce Sweet Shop',
    description: 'Full-featured MERN e-commerce platform with cart management, Razorpay payments, and a complete admin dashboard.',
    longDescription: 'Production-grade e-commerce app for a local sweet shop. Includes product listing, cart, Razorpay checkout, order management, and admin inventory control.',
    images: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=800&fit=crop'],
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Razorpay'],
    liveUrl: 'https://example.com', githubUrl: 'https://github.com/example/sweet-shop',
    status: 'Live', order: 1, visitors: 89, featured: true,
  },
  {
    name: 'Solo Leveling RPG App',
    description: 'Browser-based RPG self-improvement app inspired by Solo Leveling with quests, XP tracking, and habit-based boss battles.',
    longDescription: 'Gamified habit tracker inspired by Solo Leveling. Users complete real-life tasks as quests, earn XP, level up, and face boss challenges based on their habits.',
    images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop'],
    techStack: ['React', 'Canvas API', 'LocalStorage', 'CSS Animations'],
    liveUrl: '', githubUrl: 'https://github.com/example/solo-leveling',
    status: 'Beta', order: 2, visitors: 56, featured: false,
  },
  {
    name: 'Git / GitHub Quiz App',
    description: 'Interactive quiz testing Git and GitHub knowledge with timed questions and detailed answer explanations.',
    longDescription: 'Educational quiz covering Git fundamentals, branching, merging, GitHub workflows, pull requests, and CI/CD basics.',
    images: ['https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=800&fit=crop'],
    techStack: ['HTML', 'CSS', 'Vanilla JavaScript'],
    liveUrl: '', githubUrl: 'https://github.com/example/git-quiz',
    status: 'Archived', order: 3, visitors: 21, featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'folio' });
    console.log('✅  Connected to MongoDB');

    const { deletedCount } = await Website.deleteMany({});
    console.log(`🗑️   Cleared ${deletedCount} existing documents`);

    const inserted = await Website.insertMany(DEMO);
    console.log(`🌱  Inserted ${inserted.length} demo projects`);

    await mongoose.disconnect();
    console.log('✅  Done!');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
