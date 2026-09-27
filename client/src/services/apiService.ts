import { Crop, Disease, Equipment, TrainingModule, ScanResult, UserProgress, CommunityNote, User } from '../types';
import { firebaseService, db, auth } from './firebase';

const API_BASE_URL = 'http://localhost:5000/api';

// Pre-loaded offline seed data
import { 
  CROPS_DATA, 
  DISEASES_DATA, 
  EQUIPMENT_DATA, 
  TRAINING_MODULES_DATA, 
  COMMUNITY_NOTES_DATA, 
  PREDICTIVE_RISK_RADAR 
} from '../../../server/src/data/sampleData';

class ApiService {
  private isOnline = true;

  constructor() {
    this.checkHealth();
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
      this.isOnline = res.ok;
      return this.isOnline;
    } catch {
      // Firebase cloud is always accessible if internet is available
      this.isOnline = navigator.onLine;
      return this.isOnline;
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // AUTH (Firebase Auth + Firestore Users Collection + Phone/Email)
  public async login(identifier: string, password = 'password123'): Promise<{ user: User; token: string }> {
    try {
      const fbUser = await firebaseService.loginUser(identifier, password);
      if (fbUser) {
        const token = `jwt-fb-${fbUser.id}`;
        localStorage.setItem('kisansetu_token', token);
        localStorage.setItem('kisansetu_user', JSON.stringify(fbUser));
        localStorage.setItem('agrilens_token', token);
        localStorage.setItem('agrilens_user', JSON.stringify(fbUser));
        return { user: fbUser, token };
      }
    } catch (e) {
      console.warn('Firebase login fallback', e);
    }

    // Fallback login with entered identifier (phone or email)
    const cleanPhone = (identifier || '').replace(/\D/g, '');
    const isEmail = identifier && identifier.includes('@');
    const fallbackName = isEmail 
      ? identifier.split('@')[0].replace(/[._-]/g, ' ') 
      : `Farmer ${cleanPhone.slice(-4) || 'Ramesh'}`;
    const user: User = {
      id: `usr-${Date.now()}`,
      name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
      email: isEmail ? identifier : `${cleanPhone || 'farmer'}@kisansetu.in`,
      phone: cleanPhone || undefined,
      role: 'Farmer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      location: 'Local Farm Station #1',
      createdAt: new Date().toISOString()
    };
    const token = `jwt-kisansetu-${user.id}`;
    localStorage.setItem('kisansetu_token', token);
    localStorage.setItem('kisansetu_user', JSON.stringify(user));
    localStorage.setItem('agrilens_token', token);
    localStorage.setItem('agrilens_user', JSON.stringify(user));
    return { user, token };
  }

  public async register(name: string, email: string, role: string, password = 'password123', phone = ''): Promise<{ user: User; token: string }> {
    try {
      const fbUser = await firebaseService.registerUser(name, email, role, password, phone);
      const token = `jwt-fb-${fbUser.id}`;
      localStorage.setItem('kisansetu_token', token);
      localStorage.setItem('kisansetu_user', JSON.stringify(fbUser));
      localStorage.setItem('agrilens_token', token);
      localStorage.setItem('agrilens_user', JSON.stringify(fbUser));
      return { user: fbUser, token };
    } catch (e) {
      console.warn('Firebase register fallback', e);
      const user: User = {
        id: `usr-${Date.now()}`,
        name,
        email: email || `${phone || 'farmer'}@kisansetu.in`,
        phone: phone || undefined,
        role: (role as any) || 'Farmer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        location: 'Local Farm Sector 1',
        createdAt: new Date().toISOString()
      };
      const token = `jwt-agrilens-${user.id}`;
      localStorage.setItem('kisansetu_token', token);
      localStorage.setItem('kisansetu_user', JSON.stringify(user));
      localStorage.setItem('agrilens_token', token);
      localStorage.setItem('agrilens_user', JSON.stringify(user));
      return { user, token };
    }
  }

  // CROPS
  public async getCrops(): Promise<Crop[]> {
    try {
      if (this.isOnline) {
        const res = await fetch(`${API_BASE_URL}/crops`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Using offline crops data', e);
    }
    return CROPS_DATA;
  }

  public async getCropById(id: string): Promise<Crop | undefined> {
    const crops = await this.getCrops();
    return crops.find(c => c.id === id);
  }

  // DISEASES
  public async getDiseases(): Promise<Disease[]> {
    try {
      if (this.isOnline) {
        const res = await fetch(`${API_BASE_URL}/diseases`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Using offline diseases data', e);
    }
    return DISEASES_DATA;
  }

  public async getDiseaseById(id: string): Promise<Disease | undefined> {
    const list = await this.getDiseases();
    return list.find(d => d.id === id);
  }

  // EQUIPMENT
  public async getEquipment(): Promise<Equipment[]> {
    try {
      if (this.isOnline) {
        const res = await fetch(`${API_BASE_URL}/equipment`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Using offline equipment data', e);
    }
    return EQUIPMENT_DATA as any;
  }

  public async getEquipmentById(id: string): Promise<Equipment | undefined> {
    const eqList = await this.getEquipment();
    return eqList.find(e => e.id === id);
  }

  // TRAINING
  public async getTrainingModules(): Promise<TrainingModule[]> {
    try {
      if (this.isOnline) {
        const res = await fetch(`${API_BASE_URL}/training`);
        if (res.ok) {
          const json = await res.json();
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Using offline training data', e);
    }
    return TRAINING_MODULES_DATA as any;
  }

  public async getTrainingModuleById(id: string): Promise<TrainingModule | undefined> {
    const modules = await this.getTrainingModules();
    return modules.find(m => m.id === id);
  }

  public async recordTrainingComplete(moduleId: string, score: number, completedSteps: number, timeSpent: string): Promise<void> {
    try {
      if (this.isOnline) {
        await fetch(`${API_BASE_URL}/training/${moduleId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score, completedSteps, timeSpent })
        });
      }
    } catch (e) {
      console.warn('Offline training save', e);
    }

    // Local storage persistence
    const saved = localStorage.getItem('agrilens_progress');
    let prog: UserProgress = saved ? JSON.parse(saved) : this.getInitialProgress();
    if (!prog.moduleProgress) prog.moduleProgress = {};
    prog.moduleProgress[moduleId] = {
      completed: true,
      score,
      completedSteps,
      timeSpent
    };
    prog.completedTrainings = Object.values(prog.moduleProgress).filter(m => m.completed).length;
    const scores = Object.values(prog.moduleProgress).map(m => m.score).filter(Boolean);
    prog.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));
    localStorage.setItem('agrilens_progress', JSON.stringify(prog));
  }

  // SCANS
  public async getScans(): Promise<ScanResult[]> {
    try {
      const fbScans = await firebaseService.getScans();
      if (fbScans && fbScans.length > 0) {
        localStorage.setItem('agrilens_scans', JSON.stringify(fbScans));
        return fbScans;
      }
    } catch (e) {
      console.warn('Firebase scans get error', e);
    }

    const localScans = localStorage.getItem('agrilens_scans');
    if (localScans) {
      return JSON.parse(localScans);
    }

    const defaultScans: ScanResult[] = [
      {
        id: "scan-demo-1",
        userId: "usr-demo",
        crop: "Tomato",
        scientificName: "Solanum lycopersicum",
        condition: "Early Blight (Alternaria solani)",
        diseaseId: "tomato-early-blight",
        confidence: 0.91,
        riskLevel: "Medium",
        image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        guidanceViewed: true,
        location: "Field Block A-North",
        actionTaken: "Lower leaves pruned and bio-fungicide applied"
      },
      {
        id: "scan-demo-2",
        userId: "usr-demo",
        crop: "Rice",
        scientificName: "Oryza sativa",
        condition: "Healthy & Vigorous",
        diseaseId: "healthy-plant",
        confidence: 0.96,
        riskLevel: "Low",
        image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80",
        date: new Date(Date.now() - 86400000).toISOString(),
        guidanceViewed: true,
        location: "Paddy Basin #4",
        actionTaken: "Routine scouting recorded"
      }
    ];
    localStorage.setItem('agrilens_scans', JSON.stringify(defaultScans));
    return defaultScans;
  }

  public async saveScan(scan: Omit<ScanResult, 'id' | 'date'>): Promise<ScanResult> {
    const fullScan: ScanResult = {
      ...scan,
      id: `scan-${Date.now()}`,
      date: new Date().toISOString()
    };

    // Save to Firestore Realtime Database
    try {
      await firebaseService.saveScan(scan);
    } catch (e) {
      console.warn('Firestore saveScan error', e);
    }

    const currentScans = await this.getScans();
    const updated = [fullScan, ...currentScans];
    localStorage.setItem('agrilens_scans', JSON.stringify(updated));

    return fullScan;
  }

  // PROGRESS
  public async getProgress(): Promise<UserProgress> {
    const saved = localStorage.getItem('agrilens_progress');
    if (saved) {
      return JSON.parse(saved);
    }
    const init = this.getInitialProgress();
    localStorage.setItem('agrilens_progress', JSON.stringify(init));
    return init;
  }

  private getInitialProgress(): UserProgress {
    return {
      userId: "usr-demo",
      totalScans: 8,
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
    };
  }

  // RISK RADAR
  public async getRiskRadar() {
    return PREDICTIVE_RISK_RADAR;
  }

  // COMMUNITY NOTES (Synced with Firestore)
  public async getCommunityNotes(): Promise<CommunityNote[]> {
    try {
      const fbNotes = await firebaseService.getCommunityNotes();
      if (fbNotes && fbNotes.length > 0) {
        localStorage.setItem('agrilens_community', JSON.stringify(fbNotes));
        return fbNotes;
      }
    } catch (e) {
      console.warn('Firebase community notes get error', e);
    }

    const local = localStorage.getItem('agrilens_community');
    if (local) return JSON.parse(local);
    localStorage.setItem('agrilens_community', JSON.stringify(COMMUNITY_NOTES_DATA));
    return COMMUNITY_NOTES_DATA as any;
  }

  public async addCommunityNote(note: Partial<CommunityNote>): Promise<CommunityNote> {
    const newNote = await firebaseService.addCommunityNote(note);
    const notes = await this.getCommunityNotes();
    const updated = [newNote, ...notes.filter(n => n.id !== newNote.id)];
    localStorage.setItem('agrilens_community', JSON.stringify(updated));
    return newNote;
  }

  public async upvoteCommunityNote(id: string): Promise<number> {
    await firebaseService.upvoteCommunityNote(id);
    const notes = await this.getCommunityNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
      note.upvotes += 1;
      localStorage.setItem('agrilens_community', JSON.stringify(notes));
      return note.upvotes;
    }
    return 0;
  }
}

export const apiService = new ApiService();
