import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "unitespace-46b16.firebaseapp.com",
  projectId: "unitespace-46b16",
  storageBucket: "unitespace-46b16.appspot.com",
  messagingSenderId: "728967524734",
  appId: "1:728967524734:web:5c7a34cd6d18af722a432f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
