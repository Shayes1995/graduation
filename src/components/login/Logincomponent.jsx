import React, { useState } from 'react';
import { db } from '../../firebase/configfb';
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email) {
            setError("Please enter your email");
            return;
        }

        if (!emailPattern.test(email)) {
            setError('Invalid email format! Email must be in the format: example@domain.com');
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
                        <button className='google-btn-btn' onClick={handleGoogleSignIn}>
                            <div className="container-google">
                                <img src={LogoGmail} alt="google logo" />
                            </div>
                            <p>
                                Logga in med Google
                            </p>
                        </button>
                    </div>
                    <p className='center'>Logga in på ditt AcademicWorks konto</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">E-post *</label>
                            <input id="email" type="email" className="input-login" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <small>Email must be in the format: example@domain.com</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Lösenord *</label>
                            <input id="password" type="password" className="input-login" value={password} onChange={(e) => setPassword(e.target.value)} />
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