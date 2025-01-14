import React, { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import { useNavigate } from 'react-router';

const Adminlogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();

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
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Admin Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
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
