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

const createAdsCollection = async (post) => {
    try {
        const adsSnapshot = await getDocs(collection(db, "ads"));
        if (adsSnapshot.empty) {
            console.log("Creating 'ads' collection");

            
            await setDoc(doc(db, "ads", "sampleAd"), {
                title: "Frontend Developer",
                introDesc: "Join our dynamic team!",
                location: "Stockholm, Sweden",
                category: "IT & Tech",
                jobform: "Full-time",
                startDate: "2025-02-01",
                typeOfAssignment: "Permanent",
                description: "We are looking for a talented Frontend Developer.",
                detailedDesc: "Your responsibilities will include developing and maintaining web applications.",
                keyWords: ["React", "JavaScript", "Frontend"],
                offerings: ["Flexible hours", "Remote work", "Competitive salary"],
                requirements: ["3+ years experience", "Proficient in React"],
                personalTraits: ["Team player", "Problem solver"],
                createdAt: new Date(),
            });
            
            console.log("✅ 'ads' collection created!");
        } else {
            console.log("✅ 'ads' collection already exists!");
        }
    } catch (error) {
        console.error("❌ Error creating 'ads' collection:", error);
    }
};

// Run the function
createAdsCollection();
// Run the function
createUsersCollection();

export { db, app };
