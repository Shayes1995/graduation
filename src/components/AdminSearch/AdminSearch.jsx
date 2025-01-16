import React, { useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/configfb';

const AdminSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        const keywordArray = keyword.split(',').map(k => k.trim().toLowerCase());
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => doc.data());

        const filteredUsers = users.filter(user => {
            const userKeywords = [
                user.firstName?.toLowerCase() || '',
                user.lastName?.toLowerCase() || '',
                user.city?.toLowerCase() || '',
                ...(user.skills || []).map(skill => skill.toLowerCase())
            ];
            return keywordArray.every(k => 
                userKeywords.some(userKeyword => userKeyword.includes(k))
            );
        });

        setResults(filteredUsers);
    };

    return (
        <div className="admin-search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by name, city, or skill"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div className="search-results">
                {results.map((user, index) => (
                    <div key={index} className="user-card">
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>{user.bio}</p>
                        <p>Skills: {(user.skills || []).join(', ')}</p>
                        <a href={user.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSearch;