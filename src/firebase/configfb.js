import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWHKmhpnPU29eJf5Xy-qDD2dfaSU913FA",
    authDomain: "awbank-f9def.firebaseapp.com",
    projectId: "awbank-f9def",
    storageBucket: "awbank-f9def.firebasestorage.app",
    messagingSenderId: "49742667365",
    appId: "1:49742667365:web:882dc3b87774ca79a6b08c"
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
