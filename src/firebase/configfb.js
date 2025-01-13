import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAiWoBDTGGzCQ58pZI3m1m9O20qBXSrBfs",
    authDomain: "awbank-21193.firebaseapp.com",
    projectId: "awbank-21193",
    storageBucket: "awbank-21193.firebasestorage.app",
    messagingSenderId: "236986963840",
    appId: "1:236986963840:web:3524d8e8b46e64079c5365"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createUsersCollection = async () => {
    try {
        //använd getDocs för att kolla collectionen i vår db om "users" finns
        const usersSnapshot = await getDocs(collection(db, "users"));
        if (usersSnapshot.empty) {
            console.log("Creating");

            await setDoc(doc(db, "users", "sampleUser"), {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
                createdAt: new Date(),
            });

            console.log("✅ 'users' collection created!");
        } else {
            console.log("✅ 'users' collection already exists!");
        }
    } catch (error) {
        console.error("❌ Error creating 'users' collection:", error);
    }
};

// Run the function
createUsersCollection();

export { db, app };
