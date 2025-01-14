import React, { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import { useNavigate } from 'react-router';
import './Adminlogin.css';

const Adminlogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const adminUid = localStorage.getItem('adminUid');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;


            const adminsRef = collection(db, 'admins');
            const q = query(adminsRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const adminData = querySnapshot.docs[0].data();

                const adminWithUID = {
                    ...adminData,
                    uid: uid,
                };

                setError('');
                alert('Admin login successful!');
                localStorage.setItem('admin', JSON.stringify(adminWithUID));
                navigate('/admin/add-posts');


            } else {
                setError('Admin does not exist in the database.');
            }
        } catch (err) {
            console.error('Login error:', err.message);
            setError('Invalid email or password');
        }
    };

    return (
        <div className='main-login'>
            <div className="container">
                <div className="row">
                    <div className="container-for-form">
                        <h2>Admin Login</h2>
                        <form className='form-admin-login' onSubmit={handleSubmit}>
                            <div className="form-group-admin">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="input-login"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group-admin">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input-login"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adminlogin;
