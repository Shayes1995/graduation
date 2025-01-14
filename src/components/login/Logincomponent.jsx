import React from 'react'
import { useEffect, useState } from 'react'
import { db } from '../../firebase/configfb'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import './Logincomponent.css'
import Logo from './awlogo.svg'
const Logincomponent = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const db = getFirestore();

        if (!email) {
            setEmailError(true);
            return;
        }
        if (!password) {
            setPasswordError(true);
            return;
        }
    }

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
                        <div className="form-group">

                            <span>
                                <a href="">Glömt lösenord?</a>
                            </span>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="button-login">Logga in</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Logincomponent