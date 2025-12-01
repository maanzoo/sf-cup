import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Senin projene (sfcupinho) ait özel kimlik bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyD5o-w5UeBcgZkRhiN7cT1UEUr7pY5JcHo",
  authDomain: "sfcupinho.firebaseapp.com",
  projectId: "sfcupinho",
  storageBucket: "sfcupinho.firebasestorage.app",
  messagingSenderId: "433650356806",
  appId: "1:433650356806:web:06754bd25a598a9680b047",
  measurementId: "G-CBN97QL8PX"
};

// Firebase uygulamasını başlatıyoruz
const app = initializeApp(firebaseConfig);

// Veritabanı bağlantısını (db) oluşturup dışarı aktarıyoruz
// Bu sayede page.js dosyasında "import { db } ..." diyerek kullanabileceğiz
export const db = getFirestore(app);