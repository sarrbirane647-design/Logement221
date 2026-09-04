import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: "TA_VRAIE_API_KEY",
  authDomain: "logement221-53840.firebaseapp.com",
  projectId: "logement221-53840",
  storageBucket: "logement221-53840.firebasestorage.app",
  messagingSenderId: "598885150240",
  appId: "1:598885150240:web:95fe9e776aad4a07511645"
};

const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("6Lfym6ktAAAAANxVijCR8LpZ6-_pBpobWg85uBGv"),
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;