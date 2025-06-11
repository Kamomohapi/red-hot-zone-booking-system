// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDD3c7J0cDoeE7GmDpzIfOIrYVMKLgo4gA",
  authDomain: "rhz-salon-booking-system.firebaseapp.com",
  projectId: "rhz-salon-booking-system",
  storageBucket: "rhz-salon-booking-system.firebasestorage.app",
  messagingSenderId: "168440983534",
  appId: "1:168440983534:web:3ccaf920f053b9f10a68ff",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
