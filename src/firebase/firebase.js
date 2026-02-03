import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiw7jITur5YEGwkyTcFEZnp5Av-BlmEVM",
  authDomain: "ai-yt-a6abc.firebaseapp.com",
  projectId: "ai-yt-a6abc",
  storageBucket: "ai-yt-a6abc.firebasestorage.app",
  messagingSenderId: "352315327695",
  appId: "1:352315327695:web:2c32549d6586e4dc6ca3ba",
  measurementId: "G-EQMJP6YDP3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;