import React, { useState } from 'react';
import { db } from '../../firebase/configfb';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import './Registercomponent.css';
import { Link, useNavigate } from 'react-router-dom';

const RegisterComponent = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        city: '',
        adress: '',
        postalCode: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (!emailPattern.test(formData.email)) {
            alert('Invalid email format! Email must be in the format: example@domain.com');
            return;
        }

        if (!passwordPattern.test(formData.password)) {
            alert('Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await setDoc(doc(collection(db, 'users'), user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                city: formData.city,
                adress: formData.adress,
                postalCode: formData.postalCode,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
            });

            alert('User registered successfully!');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user: ' + error.message);
        }
    };

    return (
        <div className='register-container'>
            <form className='form-container' onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="firstName">Förnamn</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Efternamn</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="city">Stad</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="adress">Adress</label>
                    <input type="text" id="adress" name="adress" value={formData.adress} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="postalCode">Postnummer</label>
                    <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="phoneNumber">Telefonnummer</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">E-post</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="d-rw">
                    <div className="input-group rw-input">
                        <label htmlFor="password">Lösenord</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        <small>Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.</small>
                    </div>
                    <div className="input-group rw-input">
                        <label htmlFor="confirmPassword">Bekräfta lösenord</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                </div>

                <button type="submit">Registrera</button>
                <div className="form-group">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </form>
        </div>
    );
};

export default RegisterComponent;