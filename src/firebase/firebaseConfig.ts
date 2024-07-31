// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFaLCJGigeIjHKu-ux_6SPoXpBC_nej8Q",
  authDomain: "taoone-c4bb7.firebaseapp.com",
  projectId: "taoone-c4bb7",
  storageBucket: "taoone-c4bb7.appspot.com",
  messagingSenderId: "96853507803",
  appId: "1:96853507803:web:2c791fac1a81e79ba7d6fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage};