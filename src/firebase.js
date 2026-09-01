import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBc5j5pMxUU_43a6pH0wARKiE_aG_XUtfE",
  authDomain: "logement221-53840.firebaseapp.com",
  projectId: "logement221-53840",
  storageBucket: "logement221-53840.firebasestorage.app",
  messagingSenderId: "598885150240",
  appId: "1:598885150240:web:95fe9e776aad4a07511645"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;