import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);

const createAdminUser = async () => {
    const adminEmail = "Admin@test.com";
    const adminPassword = "Admin123";
    const adminDocRef = doc(db, "admins", "admin");

    try {
        const adminDoc = await getDoc(adminDocRef);
        if (!adminDoc.exists()) {
            try {
                // Try to sign in the admin user
                await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
                console.log("✅ Admin user signed in!");
            } catch (signInError) {
                if (signInError.code === 'auth/user-not-found') {
                    // Create admin user in Firebase Authentication
                    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
                    const user = userCredential.user;

                    // Add admin user to Firestore
                    await setDoc(adminDocRef, {
                        id: user.uid,
                        name: "Admin",
                        email: adminEmail,
                        role: "admin",
                        bio: "",
                        cvUrl: "",
                        hashtags: [],
                        createdAt: new Date(),
                    });

                    console.log("✅ Admin user created!");
                } else {
                    console.error("❌ Error signing in admin user:", signInError);
                }
            }
        } else {
            console.log("✅ Admin user already exists in Firestore!");
        }
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
    }
};

// Run the function
createAdminUser();

export { db, app, auth };