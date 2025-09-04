import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6ptEOk7wcr_x96pMtOvXGgW5IXkYxU7o",
  authDomain: "sportcourt-a53bd.firebaseapp.com",
  projectId: "sportcourt-a53bd",
  storageBucket: "sportcourt-a53bd.appspot.com", 
  messagingSenderId: "878821927072",
  appId: "1:878821927072:web:0d43b84ef0b3b17858c1c5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
