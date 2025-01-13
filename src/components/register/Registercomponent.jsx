import React, { useState } from 'react';
import { db } from '../../firebase/configfb';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Lägg till användaren i Firestore
            await setDoc(doc(db, 'users', user.uid), {
                id: user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                city: formData.city,
                adress: formData.adress,
                postalCode: formData.postalCode,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                role: 'user',
                createdAt: new Date(),
                lastOnline: new Date(),
            });

            console.log('User registered:', user);
        } catch (error) {
            console.error('Error registering user:', error);
            alert(error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="form-container">
                <h2>Register User</h2>
                <form onSubmit={handleSubmit}>
                    {/* Förnamn */}
                    <div className="input-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Efternamn */}
                    <div className="input-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Stad */}
                    <div className="input-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Adress */}
                    <div className="input-group">
                        <label htmlFor="adress">Adress</label>
                        <input
                            type="text"
                            id="adress"
                            name="adress"
                            value={formData.adress}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Postnummer */}
                    <div className="input-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Telefonnummer */}
                    <div className="input-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Lösenord */}
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Bekräfta Lösenord */}
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterComponent;
