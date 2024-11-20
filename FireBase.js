import {initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyArZeaZbON-O7o6YFxt0T8WIOcNqhDdfxc",
    authDomain: "geogessr-56ff7.firebaseapp.com",
    projectId: "geogessr-56ff7",
    storageBucket: "geogessr-56ff7.firebasestorage.app",
    messagingSenderId: "725022247932",
    appId: "1:725022247932:web:a90655e2e54487acbe8079",
    measurementId: "G-P9EFS4K52H"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export default app