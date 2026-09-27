import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://AKHIL:akhil123@cluster0.vj4ctcg.mongodb.net/kisansetu?retryWrites=true&w=majority';

export async function connectMongoDB() {
  try {
    if (MONGODB_URI.includes('<db_password>')) {
      console.log('⚠️ MongoDB URI contains <db_password> placeholder. Set MONGODB_URI in server/.env with your actual database password.');
      return false;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('🍃 Connected to MongoDB Atlas Database successfully!');
    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB connection error (operating in offline fallback mode):', (err as Error).message);
    return false;
  }
}

// Schemas
const ScanSchema = new mongoose.Schema({
  userId: String,
  crop: String,
  scientificName: String,
  condition: String,
  diseaseId: String,
  confidence: Number,
  riskLevel: String,
  image: String,
  date: { type: Date, default: Date.now },
  guidanceViewed: { type: Boolean, default: false },
  location: String,
  actionTaken: String
});

const CommunityNoteSchema = new mongoose.Schema({
  author: String,
  role: String,
  avatar: String,
  timeAgo: String,
  location: String,
  crop: String,
  title: String,
  content: String,
  image: String,
  upvotes: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  solved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const ScanModel = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
export const CommunityNoteModel = mongoose.models.CommunityNote || mongoose.model('CommunityNote', CommunityNoteSchema);
