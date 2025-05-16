// // Import the functions you need from the SDKs you need
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBGdSdVSYf86Ha0kycoUbXnsqV3A85c87Q",
//   authDomain: "pumpkin-5dd0f.firebaseapp.com",
//   projectId: "pumpkin-5dd0f",
//   storageBucket: "pumpkin-5dd0f.firebasestorage.app",
//   messagingSenderId: "675803566938",
//   appId: "1:675803566938:web:8d2815ece91ad499751963",
//   measurementId: "G-KHQXD1TJZ2",
// };

// // Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
// const db = getFirestore();
// const storage = getStorage();

// export { app, analytics, db, storage };

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNdYTyIsZhCV4fnHLcoZBGpSVtIbMvar8",
  authDomain: "pumpkin-web.firebaseapp.com",
  projectId: "pumpkin-web",
  storageBucket: "pumpkin-web.appspot.com",
  messagingSenderId: "550014237389",
  appId: "1:550014237389:web:457b2ff73a2361e58e4784",
  measurementId: "G-BVEX7ZTZ0S",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getFirestore();
const storage = getStorage();

export { app, analytics, db, storage };
