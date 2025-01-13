import React from 'react'
import { useEffect, useState } from 'react'
import { db } from '../../firebase/configfb'
import {Sig, getAuth } from 'firebase/auth'

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
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Logincomponent