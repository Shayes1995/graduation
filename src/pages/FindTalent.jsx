import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configfb';
import { collection, getDocs, query, where } from 'firebase/firestore';

const FindTalent = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const q = query(collection(db, 'users'), where('role', '==', 'user'));
            const querySnapshot = await getDocs(q);
            const usersData = querySnapshot.docs.map(doc => doc.data());
            setUsers(usersData);
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => user.hashtags.includes(search));

    return (
        <div>
            <h2>Find Talent</h2>
            <input
                type="text"
                placeholder="Search by hashtag"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        <h3>{user.name}</h3>
                        <p>{user.bio}</p>
                        <a href={user.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FindTalent;