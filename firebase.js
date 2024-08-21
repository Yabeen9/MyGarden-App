// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // Add isSupported import
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxDuZxO88kEtU_sy9oOj1vlqPKk0riygM",
  authDomain: "inventory-management-8523a.firebaseapp.com",
  projectId: "inventory-management-8523a",
  storageBucket: "inventory-management-8523a.appspot.com",
  messagingSenderId: "423141235506",
  appId: "1:423141235506:web:a61e5c396168c3278a152b",
  measurementId: "G-910E8EZS3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    } else {
      console.log("Firebase Analytics is not supported in this environment.");
    }
  });
}

export { firestore };
