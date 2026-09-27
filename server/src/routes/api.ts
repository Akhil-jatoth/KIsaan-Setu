import { Router, Request, Response } from 'express';
import { 
  CROPS_DATA, 
  DISEASES_DATA, 
  EQUIPMENT_DATA, 
  TRAINING_MODULES_DATA, 
  COMMUNITY_NOTES_DATA, 
  PREDICTIVE_RISK_RADAR 
} from '../data/sampleData.js';

const router = Router();

// In-memory persistent demo state
let userScans: any[] = [
  {
    id: "scan-demo-1",
    userId: "usr-demo",
    crop: "Tomato",
    scientificName: "Solanum lycopersicum",
    condition: "Early Blight (Alternaria solani)",
    confidence: 0.91,
    riskLevel: "Medium",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    guidanceViewed: true,
    location: "Field Block A-North",
    actionTaken: "Lower leaves pruned and straw mulch applied"
  },
  {
    id: "scan-demo-2",
    userId: "usr-demo",
    crop: "Rice",
    scientificName: "Oryza sativa",
    condition: "Healthy & Vigorous",
    confidence: 0.96,
    riskLevel: "Low",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80",
    date: new Date(Date.now() - 86400000).toISOString(),
    guidanceViewed: true,
    location: "Paddy Basin #4",
    actionTaken: "Routine scouting logged"
  }
];

let userProgress: Record<string, any> = {
  "usr-demo": {
    userId: "usr-demo",
    totalScans: 14,
    completedTrainings: 3,
    averageScore: 92,
    learningStreakDays: 5,
    cropsIdentifiedCount: 4,
    diseasesDiagnosedCount: 6,
    badges: [
      { id: "b1", title: "AR Pioneer", icon: "Camera", unlockedAt: "2026-09-20" },
      { id: "b2", title: "Master Inspector", icon: "Wrench", unlockedAt: "2026-09-22" },
      { id: "b3", title: "Pathology Scout", icon: "ShieldAlert", unlockedAt: "2026-09-24" }
    ],
    moduleProgress: {
      "module-tractor-safety": { completed: true, score: 95, completedSteps: 5, timeSpent: "04:12" },
      "module-crop-planting": { completed: true, score: 90, completedSteps: 3, timeSpent: "05:30" },
      "module-disease-identification": { completed: true, score: 92, completedSteps: 3, timeSpent: "06:15" },
      "module-irrigation-basics": { completed: false, score: 0, completedSteps: 1, timeSpent: "01:20" },
      "module-harvesting-basics": { completed: false, score: 0, completedSteps: 0, timeSpent: "00:00" }
    }
  }
};

let communityNotes = [...COMMUNITY_NOTES_DATA];

// ================= AUTH ROUTES =================
router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, role, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const user = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'Farmer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date().toISOString()
  };
  const token = `jwt-agrilens-ar-${user.id}`;
  return res.json({ success: true, token, user });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = {
    id: 'usr-demo',
    name: 'Dr. Arjun Patel',
    email: email || 'arjun.patel@agrilens.ai',
    role: 'Lead Agronomist & Trainer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-15T08:00:00.000Z'
  };
  const token = `jwt-agrilens-ar-${user.id}`;
  return res.json({ success: true, token, user });
});

router.get('/auth/me', (req: Request, res: Response) => {
  const user = {
    id: 'usr-demo',
    name: 'Dr. Arjun Patel',
    email: 'arjun.patel@agrilens.ai',
    role: 'Lead Agronomist & Trainer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-15T08:00:00.000Z'
  };
  return res.json({ user });
});

// ================= CROPS ROUTES =================
router.get('/crops', (_req: Request, res: Response) => {
  res.json({ success: true, data: CROPS_DATA });
});

router.get('/crops/:id', (req: Request, res: Response) => {
  const crop = CROPS_DATA.find(c => c.id === req.params.id);
  if (!crop) return res.status(404).json({ error: 'Crop not found' });
  res.json({ success: true, data: crop });
});

// ================= DISEASES ROUTES =================
router.get('/diseases', (_req: Request, res: Response) => {
  res.json({ success: true, data: DISEASES_DATA });
});

router.get('/diseases/:id', (req: Request, res: Response) => {
  const disease = DISEASES_DATA.find(d => d.id === req.params.id);
  if (!disease) return res.status(404).json({ error: 'Disease not found' });
  res.json({ success: true, data: disease });
});

// ================= EQUIPMENT ROUTES =================
router.get('/equipment', (_req: Request, res: Response) => {
  res.json({ success: true, data: EQUIPMENT_DATA });
});

router.get('/equipment/:id', (req: Request, res: Response) => {
  const eq = EQUIPMENT_DATA.find(e => e.id === req.params.id);
  if (!eq) return res.status(404).json({ error: 'Equipment not found' });
  res.json({ success: true, data: eq });
});

// ================= TRAINING ROUTES =================
router.get('/training', (_req: Request, res: Response) => {
  res.json({ success: true, data: TRAINING_MODULES_DATA });
});

router.get('/training/:id', (req: Request, res: Response) => {
  const module = TRAINING_MODULES_DATA.find(m => m.id === req.params.id);
  if (!module) return res.status(404).json({ error: 'Training module not found' });
  res.json({ success: true, data: module });
});

router.post('/training/:id/progress', (req: Request, res: Response) => {
  const { completedSteps, score } = req.body;
  const modId = req.params.id;
  const current = userProgress['usr-demo'] || {};
  if (!current.moduleProgress) current.moduleProgress = {};
  current.moduleProgress[modId] = {
    completed: false,
    score: score || 0,
    completedSteps: completedSteps || 1,
    timeSpent: '02:45'
  };
  res.json({ success: true, data: current.moduleProgress[modId] });
});

router.post('/training/:id/complete', (req: Request, res: Response) => {
  const { score, completedSteps, timeSpent } = req.body;
  const modId = req.params.id;
  const current = userProgress['usr-demo'];
  if (current) {
    if (!current.moduleProgress) current.moduleProgress = {};
    current.moduleProgress[modId] = {
      completed: true,
      score: score || 90,
      completedSteps: completedSteps || 5,
      timeSpent: timeSpent || '04:30'
    };
    current.completedTrainings = Object.values(current.moduleProgress).filter((m: any) => m.completed).length;
    const scores = Object.values(current.moduleProgress).map((m: any) => m.score).filter(Boolean);
    current.averageScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
  }
  res.json({ success: true, message: 'Training recorded successfully', data: current });
});

// ================= SCANS & AI DETECTION ROUTES =================
router.get('/scans', (_req: Request, res: Response) => {
  res.json({ success: true, data: userScans });
});

router.post('/scans', (req: Request, res: Response) => {
  const { crop, disease, confidence, image, location, riskLevel } = req.body;
  const newScan = {
    id: `scan-${Date.now()}`,
    userId: 'usr-demo',
    crop: crop || 'Tomato',
    scientificName: crop === 'Tomato' ? 'Solanum lycopersicum' : crop === 'Potato' ? 'Solanum tuberosum' : crop === 'Corn' ? 'Zea mays' : 'Oryza sativa',
    condition: disease || 'Early Blight (Alternaria solani)',
    confidence: confidence || 0.91,
    riskLevel: riskLevel || 'Medium',
    image: image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    date: new Date().toISOString(),
    guidanceViewed: false,
    location: location || 'Field Plot #2'
  };
  userScans.unshift(newScan);
  if (userProgress['usr-demo']) {
    userProgress['usr-demo'].totalScans += 1;
  }
  res.status(201).json({ success: true, data: newScan });
});

// ================= PROGRESS & RADAR ROUTES =================
router.get('/progress', (_req: Request, res: Response) => {
  res.json({ success: true, data: userProgress['usr-demo'] });
});

router.get('/risk-radar', (_req: Request, res: Response) => {
  res.json({ success: true, data: PREDICTIVE_RISK_RADAR });
});

// ================= COMMUNITY NOTES ROUTES =================
router.get('/community', (_req: Request, res: Response) => {
  res.json({ success: true, data: communityNotes });
});

router.post('/community', (req: Request, res: Response) => {
  const { title, content, crop, image, location } = req.body;
  const newNote = {
    id: `note-${Date.now()}`,
    author: 'Dr. Arjun Patel',
    role: 'Lead Agronomist',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'Just now',
    location: location || 'Field Station #1',
    crop: crop || 'General',
    title: title || 'Field Observation Note',
    content: content || '',
    image: image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    upvotes: 1,
    commentsCount: 0,
    solved: false,
    comments: []
  };
  communityNotes.unshift(newNote);
  res.status(201).json({ success: true, data: newNote });
});

router.post('/community/:id/upvote', (req: Request, res: Response) => {
  const note = communityNotes.find(n => n.id === req.params.id);
  if (note) {
    note.upvotes += 1;
    return res.json({ success: true, upvotes: note.upvotes });
  }
  res.status(404).json({ error: 'Note not found' });
});

export default router;
