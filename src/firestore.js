import firebase from "firebase";
const config = {
  apiKey: "AIzaSyBTU7Hum8XMQvgv43wMbiBo_p4X_CceB_Y",
  authDomain: "findme-1f656.firebaseapp.com",
  databaseURL: "https://findme-1f656-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "findme-1f656",
  storageBucket: "findme-1f656.appspot.com",
  messagingSenderId: "122058580594",
  appId: "1:122058580594:web:7c8959d27928eeee0d58eb",
  measurementId: "G-GMWKSZZHVH"
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

export default firestore;