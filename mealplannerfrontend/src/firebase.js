import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyATPSNMVJzC-kv9SFCCZxWPyXbnXAug8qU",
  authDomain: "automated-meal-planner.firebaseapp.com",
  projectId: "automated-meal-planner",
  storageBucket: "automated-meal-planner.firebasestorage.app",
  messagingSenderId: "666704829764",
  appId: "1:666704829764:web:67f10677c9ff0b4e708b11",
  measurementId: "G-B0S8V04C3Z"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
