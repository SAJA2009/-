import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  orderBy, 
  limit,
  setDoc,
  doc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { QuizAttempt, ProblemAttempt, AreaOfDifficulty, Subject, Semester, GradeLevel, UserProfile } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const recordQuizAttempt = async (attempt: Omit<QuizAttempt, 'id' | 'timestamp' | 'userId'>) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const path = `users/${userId}/quiz_attempts`;
  try {
    await addDoc(collection(db, path), {
      ...attempt,
      userId,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const recordProblemAttempt = async (attempt: Omit<ProblemAttempt, 'id' | 'timestamp' | 'userId'>) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const path = `users/${userId}/problem_attempts`;
  try {
    await addDoc(collection(db, path), {
      ...attempt,
      userId,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getQuizAttempts = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const path = `users/${userId}/quiz_attempts`;
  try {
    const q = query(collection(db, path), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as QuizAttempt[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getProblemAttempts = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const path = `users/${userId}/problem_attempts`;
  try {
    const q = query(collection(db, path), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as ProblemAttempt[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getUserProfile = async (uid: string) => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', uid))); // Using query to be safe with rules initially
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as unknown as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const createUserProfile = async (profile: Omit<UserProfile, 'createdAt'>) => {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), {
      ...profile,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getAreasOfDifficulty = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const path = `users/${userId}/areas_of_difficulty`;
  try {
    const q = query(collection(db, path), orderBy('level', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as AreaOfDifficulty[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};
