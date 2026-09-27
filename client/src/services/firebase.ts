import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  increment, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { ScanResult, CommunityNote, User, UserProgress } from '../types';

// User's provided Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBcaw_ZIyzfEJ2TYCviNCvXB5wR_BozzGw",
  authDomain: "agrilens-ar.firebaseapp.com",
  projectId: "agrilens-ar",
  storageBucket: "agrilens-ar.firebasestorage.app",
  messagingSenderId: "923128756079",
  appId: "1:923128756079:web:e853c63f7e544c3800da9a",
  measurementId: "G-MJS99CSP7H"
};

// Initialize Firebase App Singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics conditionally (only in browser environment)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// ----------------------------------------------------
// FIREBASE FIRESTORE DATABASE SERVICE HELPERS
// ----------------------------------------------------

export const firebaseService = {
  // --- AUTHENTICATION & USERS ---
  async registerUser(name: string, email: string, role: string, password = 'password123', phone = ''): Promise<User> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const uid = `usr-${Date.now()}`;

    const newUser: User = {
      id: uid,
      name: name.trim() || 'Farmer',
      email: cleanEmail || (cleanPhone ? `${cleanPhone}@kisansetu.in` : 'farmer@gmail.com'),
      phone: cleanPhone || undefined,
      role: (role as any) || 'Farmer',
      avatar: role === 'Agriculture Student'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : role === 'Trainer'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      location: 'Local Farm Station #1',
      createdAt: new Date().toISOString()
    };

    // 1. Instantly cache in local registered users database with credentials
    try {
      const stored = localStorage.getItem('kisansetu_registered_users');
      const usersList: any[] = stored ? JSON.parse(stored) : [];
      const updated = [{ ...newUser, password }, ...usersList.filter((u: any) => u.email !== cleanEmail && (!cleanPhone || u.phone !== cleanPhone))];
      localStorage.setItem('kisansetu_registered_users', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 2. Asynchronously sync with Firebase Auth & Firestore without blocking user UI
    (async () => {
      try {
        if (auth && cleanEmail) {
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, password);
          } catch (authErr: any) {
            if (authErr.code === 'auth/email-already-in-use') {
              try {
                await signInWithEmailAndPassword(auth, cleanEmail, password);
              } catch {}
            }
          }
        }
        if (cleanEmail) {
          const emailDocId = encodeURIComponent(cleanEmail);
          await setDoc(doc(db, 'users', emailDocId), {
            ...newUser,
            password,
            updatedAt: Timestamp.now()
          }, { merge: true });
        }

        if (cleanPhone) {
          await setDoc(doc(db, 'users', `phone_${cleanPhone}`), {
            ...newUser,
            password,
            updatedAt: Timestamp.now()
          }, { merge: true });
        }

        await setDoc(doc(db, 'users', uid), {
          ...newUser,
          updatedAt: Timestamp.now()
        }, { merge: true });
      } catch (fbErr) {
        console.warn('Firebase background user sync notice:', fbErr);
      }
    })();

    return newUser;
  },

  async loginUser(identifier: string, password = 'password123'): Promise<User | null> {
    const raw = (identifier || '').trim();
    const cleanLower = raw.toLowerCase();
    const cleanPhone = raw.replace(/\D/g, '');

    // 1. Check local registered users cache first for instant match (by email or phone or name)
    try {
      const stored = localStorage.getItem('kisansetu_registered_users');
      if (stored) {
        const usersList: any[] = JSON.parse(stored);
        const matched = usersList.find(u => 
          (u.email && u.email.toLowerCase() === cleanLower) ||
          (cleanPhone && cleanPhone.length >= 7 && u.phone && u.phone.includes(cleanPhone)) ||
          (u.name && u.name.toLowerCase() === cleanLower)
        );
        if (matched) {
          const { password: _, ...cleanUserData } = matched;
          return cleanUserData as User;
        }
      }
    } catch {}

    // 2. Check Firestore by Email or Phone document ID (with fast timeout)
    try {
      const docKey = cleanLower.includes('@') ? encodeURIComponent(cleanLower) : `phone_${cleanPhone}`;
      const firestorePromise = getDoc(doc(db, 'users', docKey));
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
      const userDoc = await Promise.race([firestorePromise, timeoutPromise]);
      if (userDoc && 'exists' in userDoc && userDoc.exists()) {
        const data = userDoc.data() as any;
        const { password: _, ...cleanData } = data;
        return cleanData as User;
      }
    } catch (e) {
      console.warn('Firestore user query notice:', e);
    }

    // 3. Try Firebase Auth (if valid email)
    if (cleanLower.includes('@')) {
      try {
        if (auth) {
          const authPromise = signInWithEmailAndPassword(auth, cleanLower, password);
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
          const userCred = await Promise.race([authPromise, timeoutPromise]);
          if (userCred && 'user' in userCred) {
            const uid = userCred.user.uid;
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              return userDoc.data() as User;
            }
          }
        }
      } catch (e) {
        console.warn('Firebase Auth sign in notice:', e);
      }
    }

    // 4. Fallback user from identifier
    if (raw.length > 0) {
      const derivedName = cleanLower.includes('@') 
        ? cleanLower.split('@')[0].replace(/[._-]/g, ' ') 
        : `Farmer ${cleanPhone.slice(-4) || raw}`;
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      return {
        id: `usr-${Date.now()}`,
        name: formattedName,
        email: cleanLower.includes('@') ? cleanLower : `${cleanPhone || 'farmer'}@kisansetu.in`,
        phone: cleanPhone || undefined,
        role: 'Farmer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString()
      };
    }

    return null;
  },

  // --- SCANS COLLECTION ---
  async saveScan(scan: Omit<ScanResult, 'id' | 'date'>): Promise<ScanResult> {
    const scanId = `scan-${Date.now()}`;
    const fullScan: ScanResult = {
      ...scan,
      id: scanId,
      date: new Date().toISOString()
    };

    try {
      // Save directly into Firestore 'scans' collection
      await setDoc(doc(db, 'scans', scanId), {
        ...fullScan,
        createdAt: Timestamp.now()
      });
      console.log('✅ Scan saved to Firebase Firestore:', scanId);
    } catch (e) {
      console.warn('Firestore scan save error:', e);
    }

    return fullScan;
  },

  async getScans(): Promise<ScanResult[]> {
    try {
      const q = query(collection(db, 'scans'), orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const scans: ScanResult[] = [];
      querySnapshot.forEach((docSnap) => {
        scans.push(docSnap.data() as ScanResult);
      });
      if (scans.length > 0) return scans;
    } catch (e) {
      console.warn('Firestore scans get error:', e);
    }
    return [];
  },

  // Real-time Firestore listener for scans
  onScansUpdate(callback: (scans: ScanResult[]) => void) {
    try {
      const q = query(collection(db, 'scans'), orderBy('createdAt', 'desc'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const scans: ScanResult[] = [];
        snapshot.forEach((docSnap) => {
          scans.push(docSnap.data() as ScanResult);
        });
        callback(scans);
      }, (err) => {
        console.warn('Realtime scans listener error:', err);
      });
    } catch (e) {
      console.warn('Realtime scans snapshot failed:', e);
      return () => {};
    }
  },

  // --- COMMUNITY NOTES COLLECTION ---
  async getCommunityNotes(): Promise<CommunityNote[]> {
    try {
      const q = query(collection(db, 'community_notes'), orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const notes: CommunityNote[] = [];
      querySnapshot.forEach((docSnap) => {
        notes.push(docSnap.data() as CommunityNote);
      });
      if (notes.length > 0) return notes;
    } catch (e) {
      console.warn('Firestore community notes get error:', e);
    }
    return [];
  },

  async addCommunityNote(note: Partial<CommunityNote>): Promise<CommunityNote> {
    const noteId = `note-${Date.now()}`;
    const newNote: CommunityNote = {
      id: noteId,
      author: note.author || 'Dr. Arjun Patel',
      role: note.role || 'Lead Agronomist',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      timeAgo: 'Just now',
      location: note.location || 'Field Station #1',
      crop: note.crop || 'Tomato',
      title: note.title || 'Field Observation Note',
      content: note.content || '',
      image: note.image || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
      upvotes: 1,
      commentsCount: 0,
      solved: false,
      comments: []
    };

    try {
      await setDoc(doc(db, 'community_notes', noteId), {
        ...newNote,
        createdAt: Timestamp.now()
      });
      console.log('✅ Community Note saved to Firebase Firestore:', noteId);
    } catch (e) {
      console.warn('Firestore community note save error:', e);
    }

    return newNote;
  },

  async upvoteCommunityNote(id: string): Promise<void> {
    try {
      const noteRef = doc(db, 'community_notes', id);
      await updateDoc(noteRef, {
        upvotes: increment(1)
      });
    } catch (e) {
      console.warn('Firestore upvote error:', e);
    }
  },

  // Real-time Firestore listener for Community Notes
  onCommunityNotesUpdate(callback: (notes: CommunityNote[]) => void) {
    try {
      const q = query(collection(db, 'community_notes'), orderBy('createdAt', 'desc'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const notes: CommunityNote[] = [];
        snapshot.forEach((docSnap) => {
          notes.push(docSnap.data() as CommunityNote);
        });
        callback(notes);
      }, (err) => {
        console.warn('Realtime community notes listener error:', err);
      });
    } catch (e) {
      console.warn('Realtime community notes snapshot failed:', e);
      return () => {};
    }
  },

  // --- USER TRAINING PROGRESS ---
  async saveProgress(userId: string, progress: UserProgress): Promise<void> {
    try {
      await setDoc(doc(db, 'progress', userId), {
        ...progress,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore progress save error:', e);
    }
  },

  async getProgress(userId: string): Promise<UserProgress | null> {
    try {
      const progDoc = await getDoc(doc(db, 'progress', userId));
      if (progDoc.exists()) {
        return progDoc.data() as UserProgress;
      }
    } catch (e) {
      console.warn('Firestore progress get error:', e);
    }
    return null;
  }
};
