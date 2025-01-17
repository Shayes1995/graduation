import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import './Applicationhandler.css';

const ApplicationHandler = () => {
    const [applications, setApplications] = useState([]);
    const [adminNames, setAdminNames] = useState({});
    const [showAllApplications, setShowAllApplications] = useState(false); 
    const [filteredApplications, setFilteredApplications] = useState([]);
    
    const adminData = JSON.parse(localStorage.getItem('admin'));
    const loggedInAdminId = adminData?.uid || '';

    const fetchApplications = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'collectionapplications'));
            const applicationsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setApplications(applicationsList);

            const adminIds = [...new Set(applicationsList.map(app => app.adminId))];
            await fetchAdminNames(adminIds);
        } catch (error) {
            console.error('Fel vid hämtning av ansökningar:', error);
        }
    };

    const fetchAdminNames = async (adminIds) => {
        const newAdminNames = { ...adminNames };

        for (const adminId of adminIds) {
            if (!adminId || newAdminNames[adminId]) continue;

            const adminRef = doc(db, 'admins', adminId);
            const adminSnap = await getDoc(adminRef);

            if (adminSnap.exists()) {
                const adminData = adminSnap.data();
                newAdminNames[adminId] = `${adminData.firstName} ${adminData.lastName}`;
            } else {
                newAdminNames[adminId] = 'Okänd Admin';
            }
        }

        setAdminNames(newAdminNames);
    };

    useEffect(() => {
        if (showAllApplications) {
            setFilteredApplications(applications);
        } else {
            setFilteredApplications(applications.filter(app => app.adminId === loggedInAdminId));
        }
    }, [showAllApplications, applications]);

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className="applications-container">
            <div className="all-around-applications">
                <h2>Lista över ansökningar</h2>
                <div className="filter-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={showAllApplications}
                            onChange={() => setShowAllApplications(!showAllApplications)}
                        />
                        Visa alla ansökningar
                    </label>
                </div>

                <div className="central-content">
                    {filteredApplications.length > 0 ? (
                        <div className="applications-card">
                            {filteredApplications.map(app => (
                                <div key={app.id} className="application-card">
                                    <h3>{app.title}</h3>
                                    <p>Ansvarig rekryterare: <strong>{adminNames[app.adminId] || 'Laddar...'}</strong></p>
                                    <p>Antal sökande: {app.applicants.length}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Inga ansökningar hittades.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationHandler;
