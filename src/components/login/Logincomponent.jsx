import React, { useState } from 'react';
import { db } from '../../firebase/configfb';
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Logincomponent.css';
import Logo from './awlogo.svg';
import LogoGmail from './gmail.png';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logincomponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Please enter your email");
            return;
        }
        if (!password) {
            setError("Please enter your password");
            return;
        }

        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

           
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();

                const completeUserData = {
                    uid: user.uid,
                    role: userData.role || "user", 
                    ...userData,
                };
    
                console.log('User data:', userDoc.data());
                Cookies.set('user', JSON.stringify(userDoc.data()), { expires: 7 }); // Set cookie for 7 days
                localStorage.setItem('user', JSON.stringify(completeUserData));
                navigate('/'); // Redirect to home page
            } else {
                console.error('Ingen användardata hittades!');
                setError('Ingen användardata hittades!');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Fel vid inloggning: ' + error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                
                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    role: "user", 
                });
            }

            // spara cookies o localstorage
            Cookies.set('user', JSON.stringify(userDoc.data()), { expires: 7 });
            localStorage.setItem('user', JSON.stringify(userDoc.exists() ? userDoc.data() : { uid: user.uid, name: user.displayName, email: user.email, role: "user" }));

            navigate('/');
        } catch (error) {
            console.error("Google sign-in error:", error);
            setError("Google-inloggning misslyckades: " + error.message);
        }
    };

    return (
        <div className='login-container'>
            <div className="container">
                <div className="row">
                    <div className="logo-container">
                        <img src={Logo} alt="logo" />
                    </div>
                    <h2 className='center'>Logga in</h2>
                    <div className="google-btn">
                        <button onClick={handleGoogleSignIn}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="google logo" />
                            Logga in med Google
                        </button>
                    </div>
                    <p className='center'>Logga in på ditt AcademicWorks konto</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>E-post *</label>
                            <input type="email" className="input-login" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Lösenord *</label>
                            <input type="password" className="input-login" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="form-group">
                            <span>
                                <a href="">Glömt lösenord?</a>
                            </span>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="button-login">Logga in</button>
                        </div>
                        <div className="form-group">
                            <p>Don't have an account? <Link to="/register">Register here</Link></p>
                            <p>Do you work here? <Link to="/admin">Press here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Logincomponent;