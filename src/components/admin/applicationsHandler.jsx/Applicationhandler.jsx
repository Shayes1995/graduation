import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import './Applicationhandler.css';

const ApplicationHandler = () => {
    const [applications, setApplications] = useState([]);
    const [adminNames, setAdminNames] = useState({});
    const [showAllApplications, setShowAllApplications] = useState(false);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applicantNames, setApplicantNames] = useState([]);

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
    const fetchApplicantDetails = async (applicantIds) => {
        if (!Array.isArray(applicantIds)) {
            console.error("Fel: applicantIds är inte en array", applicantIds);
            return;
        }

        const newApplicantDetails = { ...applicantNames }; 

       
        const missingIds = applicantIds.filter(userId => userId && !newApplicantDetails[userId]);
        if (missingIds.length === 0) return;

        try {
            const fetchedDetails = await Promise.all(
                missingIds.map(async (uid) => {
                    const userRef = doc(db, 'users', uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        return {
                            id: uid,
                            ...userData, // hämta  användarinformation
                        };
                    } else {
                        return {
                            id: uid,
                            firstName: "Okänd",
                            lastName: "",
                            email: "Ej tillgänglig",
                            phoneNumber: "Ej tillgänglig",
                            city: "Ej tillgänglig",
                            skills: [],
                            profilePicUrl: "",
                        };
                    }
                })
            );

            // uoodatera state med hämtade detaljer
            fetchedDetails.forEach(user => {
                newApplicantDetails[user.id] = user;
            });

            setApplicantNames(newApplicantDetails);
        } catch (error) {
            console.error('Fel vid hämtning av användardata:', error);
        }
    };

    const openModal = (application) => {
        setSelectedApplication(application);

        console.log("Applicants-data:", application.applicants);

          // hämta alla sökandes ID:n
        const applicantIds = application.applicants?.map(applicant => applicant.userId).filter(Boolean) || [];

        fetchApplicantDetails(applicantIds);
    };





    const closeModal = () => {
        setSelectedApplication(null);
        setApplicantNames([]);
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
                <h2>Lista över mina ansökningar</h2>
                <div className="filter-checkbox">
                    <label>
                        <input
                            className='checkbox'
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
                                <div key={app.id} className="application-card" onClick={() => openModal(app)}>
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

            {selectedApplication && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="top-header">
                            <h2>{selectedApplication.title}</h2>
                            <input type="text" />
                            <button>Filtrera</button>
                        </div>
                        <h3>Sökande:</h3>

                        <ul>
                            {selectedApplication && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <div className="top-header">
                                            <h2>{selectedApplication.title}</h2>
                                            <input type="text" />
                                            <button>Filtrera</button>
                                        </div>

                                        {selectedApplication.applicants.map((applicant, index) => (
                                            <div key={index} className="applicant-cards">
                                                <div className="img-container-profile">
                                                    <img src={applicantNames[applicant.userId]?.profilePicUrl} alt="Profilbild" />
                                                </div>
                                                <div className="user-info">
                                                    <p><strong>Namn:</strong> {applicantNames[applicant.userId]?.firstName} {applicantNames[applicant.userId]?.lastName}</p>
                                                    <p><strong>Email:</strong> {applicantNames[applicant.userId]?.email}</p>
                                                    <p><strong>Telefon:</strong> {applicantNames[applicant.userId]?.phoneNumber}</p>
                                                    <p><strong>Stad:</strong> {applicantNames[applicant.userId]?.city}</p>
                                                </div>
                                                <div className="">
                                                    <p><strong>Skills:</strong> {applicantNames[applicant.userId]?.skills?.join(", ") || "Inga"}</p>
                                                </div>
                                            </div>
                                        ))}

                                        <button className="close-button" onClick={closeModal}>Stäng</button>
                                    </div>
                                </div>
                            )}


                        </ul>
                        <button className="close-button" onClick={closeModal}>Stäng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationHandler;
