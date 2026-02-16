const firebaseConfig = {
  apiKey: "AIzaSyDDh6N1NcFNHPDJO2ruEchJ2NLCFJPPWlQ",
  authDomain: "gallerymold-6254e.firebaseapp.com",
  projectId: "gallerymold-6254e",
  storageBucket: "gallerymold-6254e.firebasestorage.app",
  messagingSenderId: "626271163941",
  appId: "1:626271163941:web:1717bed611834daf7a51cc",
  measurementId: "G-VDRXWVBX4P"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("Firebase connected successfully!");
