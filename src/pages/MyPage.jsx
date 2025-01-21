import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configfb';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import './MyPage.css';
import PDFUploader from '../components/candidate/PDFuploader';

const MyPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhone] = useState('');
    const [adress, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [cvUrl, setCvUrl] = useState('');
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setFirstName(userData.firstName || '');
                    setLastName(userData.lastName || '');
                    setEmail(userData.email || '');
                    setPhone(userData.phoneNumber || '');
                    setAddress(userData.adress || '');
                    setCity(userData.city || '');
                    setBio(userData.bio || '');
                    setSkills(userData.skills || []);
                    setCvUrl(userData.cvUrl || '');
                    setProfilePicUrl(userData.profilePicUrl || ''); // Add the profile picture URL from Firestore
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleSkillAdd = (e) => {
        e.preventDefault();
        if (skillInput.trim() && !skills.includes(skillInput.toLowerCase())) {
            setSkills([...skills, skillInput.toLowerCase()]);
            setSkillInput('');
        }
    };

    const handleSkillRemove = (index) => {
        const newSkills = skills.filter((_, i) => i !== index);
        setSkills(newSkills);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('User not authenticated');
            return;
        }
        try {
            const userDoc = doc(db, 'users', user.uid);
            await updateDoc(userDoc, {
                firstName,
                lastName,
                email,
                phoneNumber,
                adress,
                city,
                bio,
                skills,
                cvUrl,
                profilePicUrl,
            });
            setMessage('Profile updated successfully!');
            setIsEditing(false); // Stop editing after save
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile: ' + error.message);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true); // Activate edit mode
    };

    return (
        <div className="my-page-container">
            <h1>Welcome {firstName || 'User'}</h1>
            <h3>My Page</h3>
            <p>Håll din profil uppdaterad för att förbättra din närvaro och ge andra en bättre förståelse för vem du är. Genom att uppdatera din bio, lägga till dina färdigheter och dela din CV-länk kan du skapa ett starkt intryck och visa upp dina bästa sidor.</p>

            <div className="profile-card">
                <div className="profile-card-header">
                    <img
                        src={profilePicUrl || 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                        alt="User Avatar"
                        className="profile-img"
                    />
                    <h4>{firstName} {lastName || 'User Name'}</h4>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>First name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                value={adress}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your address"
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter your city"
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write a short bio about yourself..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Skills</label>
                            <div className="skills-input-container">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Enter a skill"
                                />
                                <button
                                    onClick={handleSkillAdd}
                                    className="btn btn-secondary"
                                >
                                    Add Skill
                                </button>
                            </div>
                            <ul className="skills-list">
                                {skills.map((skill, index) => (
                                    <li key={index}>
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleSkillRemove(index)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="form-group">
                            <label>CV URL</label>
                            <PDFUploader />
                        </div>
                        <div className="form-group">
                            <label>Profile Picture URL</label>
                            <input
                                type="text"
                                value={profilePicUrl}
                                onChange={(e) => setProfilePicUrl(e.target.value)}
                                placeholder="Enter your profile picture URL"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mLogin">
                            Save
                        </button>
                        {message && <p>{message}</p>}
                    </form>
                ) : (
                    <div className="profile-display">
                        <p><strong>First name:</strong> {firstName}</p>
                        <p><strong>Last name:</strong> {lastName}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phoneNumber}</p>
                        <p><strong>Address:</strong> {adress}</p>
                        <p><strong>City:</strong> {city}</p>
                        <p><strong>Bio:</strong> {bio || 'No bio provided'}</p>
                        <p><strong>CV URL:</strong> {cvUrl ? <a href={cvUrl} target="_blank" rel="noopener noreferrer">{cvUrl}</a> : 'No CV URL provided'}</p>
                        <p><strong>Skills:</strong></p>
                        <div className="d-flex flex-wrap gap-2">
                            {skills.length > 0
                                ? skills.map((skill, idx) => (
                                    <span key={idx} className="badge bg-soft-secondary fs-14">
                                        {skill}
                                    </span>
                                ))
                                : 'No skills added'}
                        </div>
                        {/* <p><strong>Skills:</strong> {skills.length > 0 ? skills.join(', ') : 'No skills added'}</p> */}
                        {/* <p><strong>Profile Picture URL:</strong> {profilePicUrl ? <a href={profilePicUrl} target="_blank" rel="noopener noreferrer">{profilePicUrl}</a> : 'No profile picture URL provided'}</p> */}
                        <button onClick={handleEditClick} className="btn btn-secondary">
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;