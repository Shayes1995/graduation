import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configfb';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import './MyPage.css';
import PDFUploader from '../components/candidate/PDFuploader';
import { supabase } from '../supabase/Supabase';
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
    const [cvExists, setCvExists] = useState(false); // ✅ Kontrollerar om CV finns

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
                    setProfilePicUrl(userData.profilePicUrl || '');
                }

                const filePath = `${user.uid}-cv.pdf`;
                const { data, error } = await supabase.storage.from("pdfs").download(filePath);

                if (!error && data) {
                    setCvExists(true);
                    setCvUrl(filePath);
                } else {
                    setCvExists(false);
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
            setMessage('Användare ej autentiserad.');
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


            setMessage('Profil uppdaterad!');
            setIsEditing(false);
        } catch (error) {
            console.error('Fel vid uppdatering av profil:', error);
            setMessage('Fel vid uppdatering av profil: ' + error.message);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <div className="my-page-container">
            <h1>Välkommen {firstName || 'Användare'}</h1>
            <p>Håll din profil uppdaterad för att ge andra en bättre förståelse för vem du är. Lägg till dina färdigheter och dela din CV-länk för att skapa ett starkt intryck.</p>

            <div className="profile-card">
                <div className="profile-card-header">
                    <img
                        src={profilePicUrl || 'https://bootdey.com/img/Content/avatar/avatar7.png'}
                        alt="Profilbild"
                        className="profile-img"
                    />
                    <h4>{firstName} {lastName || 'Namn'}</h4>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Förnamn</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ange ditt förnamn"
                            />
                        </div>
                        <div className="form-group">
                            <label>Efternamn</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Ange ditt efternamn"
                            />
                        </div>
                        <div className="form-group">
                            <label>E-post</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ange din e-postadress"
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefonnummer</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ange ditt telefonnummer"
                            />
                        </div>
                        <div className="form-group">
                            <label>Adress</label>
                            <input
                                type="text"
                                value={adress}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ange din adress"
                            />
                        </div>
                        <div className="form-group">
                            <label>Stad</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Ange din stad"
                            />
                        </div>
                        <div className="form-group">
                            <label>Beskrivning</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Skriv en kort beskrivning om dig själv..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Färdigheter</label>
                            <div className="skills-input-container">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Lägg till en färdighet"
                                />
                                <button
                                    onClick={handleSkillAdd}
                                    className="btn btn-secondary"
                                >
                                    Lägg till
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
                                            Ta bort
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
                            <label>Profilbildslänk</label>
                            <input
                                type="text"
                                value={profilePicUrl}
                                onChange={(e) => setProfilePicUrl(e.target.value)}
                                placeholder="Ange länk till din profilbild"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mLogin">
                            Spara
                        </button>
                        {message && <p>{message}</p>}
                    </form>
                ) : (
                    <div className="profile-display">
                        <p><strong>Förnamn:</strong> {firstName}</p>
                        <p><strong>Efternamn:</strong> {lastName}</p>
                        <p><strong>E-post:</strong> {email}</p>
                        <p><strong>Telefonnummer:</strong> {phoneNumber}</p>
                        <p><strong>Adress:</strong> {adress}</p>
                        <p><strong>Stad:</strong> {city}</p>
                        <p><strong>Beskrivning:</strong> {bio || 'Ingen beskrivning angiven'}</p>
                        <p><strong>CV-länk:</strong> {cvUrl ? <a href={cvUrl} target="_blank" rel="noopener noreferrer">{cvUrl}</a> : 'Ingen CV-länk angiven'}</p>
                        <p><strong>Färdigheter:</strong></p>
                        <div className="d-flex flex-wrap gap-2">
                            {skills.length > 0
                                ? skills.map((skill, idx) => (
                                    <span key={idx} className="badge bg-soft-secondary fs-14">
                                        {skill}
                                    </span>
                                ))
                                : 'Inga färdigheter angivna'}
                        </div>
                        <button onClick={handleEditClick} className="btn btn-secondary">
                            Redigera profil
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;