import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/configfb';

const AdminSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = query(collection(db, 'users'), where('skills', 'array-contains', keyword));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => doc.data());
        setResults(users);
    };

    return (
        <div className="admin-search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by skill"
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
                        <p>Skills: {user.skills.join(', ')}</p>
                        <a href={user.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSearch;