import React, { useState } from 'react';
import { db } from '../../firebase/configfb';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Logincomponent.css';
import Logo from './awlogo.svg';
import { Link, useNavigate } from 'react-router-dom';

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
                console.log('User data:', userDoc.data());
                alert('Inloggad!');
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

    return (
        <div className='login-container'>
            <div className="container">
                <div className="row">
                    <div className="logo-container">
                        <img src={Logo} alt="logo" />
                    </div>
                    <h2 className='center'>Logga in</h2>
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Logincomponent;