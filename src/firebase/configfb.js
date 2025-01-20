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
        const usersSnapshot = await getDocs(collection(db, "users"));
        if (usersSnapshot.empty) {
            console.log("Creating 'users' collection");

            await setDoc(doc(db, "users", "sampleUser"), {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                city: "Sample City",
                adress: "Sample Address",
                postalCode: "12345",
                phoneNumber: "1234567890",
                email: "john.doe@example.com",
                bio: "Sample bio",
                skills: ["React", "JavaScript"],
                cvUrl: "http://example.com/cv.pdf",
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

const createAdsCollection = async () => {
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

const createMessagesCollection = async () => {
    try {
        const messagesSnapshot = await getDocs(collection(db, "messages"));
        if (messagesSnapshot.empty) {
            console.log("Creating 'messages' collection");

            await setDoc(doc(db, "messages", "sampleMessage"), {
                senderId: "sampleSenderId",
                receiverId: "sampleReceiverId",
                message: "This is a sample message.",
                timestamp: new Date(),
            });

            console.log("✅ 'messages' collection created!");
        } else {
            console.log("✅ 'messages' collection already exists!");
        }
    } catch (error) {
        console.error("❌ Error creating 'messages' collection:", error);
    }
};

createAdsCollection();
createUsersCollection();
createMessagesCollection();

export { db, app };