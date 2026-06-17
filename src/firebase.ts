import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5Nji6uNGIXMtyT9hjL9Gf_ou8kKtrQtU",
  authDomain: "serbian-learning-7a847.firebaseapp.com",
  projectId: "serbian-learning-7a847",
  storageBucket: "serbian-learning-7a847.firebasestorage.app",
  messagingSenderId: "482409065033",
  appId: "1:482409065033:web:118cdb4ce9d11a7f1f6d98",
  measurementId: "G-HB6LQ172S7"
};

let app: any;
let auth: any;
let db: any;
let firebaseReady = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  firebaseReady = true;
} catch (e) {
  console.error('Firebase init failed:', e);
}

export { auth, db, firebaseReady };
