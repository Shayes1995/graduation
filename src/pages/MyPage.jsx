import React, { useState } from 'react';
import { db } from '../firebase/configfb';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const MyPage = () => {
    const [bio, setBio] = useState('');
    const [cvUrl, setCvUrl] = useState('');
    const [hashtags, setHashtags] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
            bio,
            cvUrl,
            hashtags: hashtags.split(',').map(tag => tag.trim()),
        });
    };

    return (
        <div>
            <h2>My Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>CV URL</label>
                    <input type="text" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Hashtags</label>
                    <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        </div>
    );
};

export default MyPage;