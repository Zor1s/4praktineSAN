import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_wRI1KDDA0x9xvQbi2MIgzqDaQX5sn1E",
  authDomain: "autoskelbk.firebaseapp.com",
  projectId: "autoskelbk",
  storageBucket: "autoskelbk.appspot.com",
  messagingSenderId: "115076600985",
  appId: "1:115076600985:web:040946f83374f27d41d408",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
