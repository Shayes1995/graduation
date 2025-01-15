import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configfb';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import './MyPage.css';

const MyPage = () => {
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [cvUrl, setCvUrl] = useState('');
    const [message, setMessage] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setBio(userData.bio || '');
                    setSkills(userData.skills || []);
                    setCvUrl(userData.cvUrl || '');
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
                bio,
                skills,
                cvUrl,
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile: ' + error.message);
        }
    };

    return (
        <div className="my-page-container">
            <h2>My Page</h2>
            <form onSubmit={handleSubmit}>
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
                    <input
                        type="text"
                        value={cvUrl}
                        onChange={(e) => setCvUrl(e.target.value)}
                        placeholder="Enter your CV URL"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
                {message && <p>{message}</p>}
            </form>
            <div className="profile-display">
                <h3>Profile Information</h3>
                <p><strong>Bio:</strong> {bio}</p>
                <p><strong>Skills:</strong> {skills.join(', ')}</p>
                <p><strong>CV URL:</strong> <a href={cvUrl} target="_blank" rel="noopener noreferrer">{cvUrl}</a></p>
            </div>
        </div>
    );
};

export default MyPage;