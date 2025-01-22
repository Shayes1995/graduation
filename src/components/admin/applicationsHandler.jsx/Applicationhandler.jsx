import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import { supabase } from '../../../supabase/Supabase';
import './Applicationhandler.css';

const ApplicationHandler = () => {
    const [applications, setApplications] = useState([]);
    const [adminNames, setAdminNames] = useState({});
    const [showAllApplications, setShowAllApplications] = useState(false);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applicantNames, setApplicantNames] = useState({});
    const [cvData, setCvData] = useState({}); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [cvUrls, setCvUrls] = useState({});
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
        const newCvData = { ...cvData };

        const missingIds = applicantIds.filter(userId => userId && !newApplicantDetails[userId]);
        if (missingIds.length === 0) return;

        try {
            const fetchedDetails = await Promise.all(
                missingIds.map(async (uid) => {
                    const userRef = doc(db, 'users', uid);
                    const userSnap = await getDoc(userRef);

                    let userData = {
                        id: uid,
                        firstName: "Okänd",
                        lastName: "",
                        email: "Ej tillgänglig",
                        phoneNumber: "Ej tillgänglig",
                        city: "Ej tillgänglig",
                        skills: [],
                        profilePicUrl: "",
                    };

                    if (userSnap.exists()) {
                        userData = {
                            id: uid,
                            ...userSnap.data(),
                        };
                    }

                    // Hämta CV-text och PDF-URL från `user_pdfs`
                    const { data, error } = await supabase
                        .from("user_pdfs")
                        .select("pdf_url, cv_text")
                        .eq("user_id", uid)
                        .single();

                    if (!error && data) {
                        newCvData[uid] = { pdfUrl: data.pdf_url, cvText: data.cv_text };
                    } else {
                        newCvData[uid] = { pdfUrl: null, cvText: "" };
                    }

                    return userData;
                })
            );

            fetchedDetails.forEach(user => {
                newApplicantDetails[user.id] = user;
            });

            setApplicantNames(newApplicantDetails);
            setCvData(newCvData);
        } catch (error) {
            console.error('Fel vid hämtning av användardata:', error);
        }
    };

    const openModal = (application) => {
        setSelectedApplication(application);
        const applicantIds = application.applicants?.map(applicant => applicant.userId).filter(Boolean) || [];
        fetchApplicantDetails(applicantIds);
    };

    const closeModal = () => {
        setSelectedApplication(null);
        setApplicantNames({});
        setCvData({});
        setSearchTerm("");
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
                        <span className='close' onClick={closeModal}>X</span>
                        <div className="top-header">
                            <h2>{selectedApplication.title}</h2>
                            <div className="input-row">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                    placeholder="Sök i CV-text..."
                                />
                            </div>
                        </div>
                        <p>Antal sökande: <strong>{selectedApplication.applicants.length}</strong></p>
                        <ul>
                            {selectedApplication.applicants
                                .filter(applicant => {
                                    const userCvText = cvData[applicant.userId]?.cvText?.toLowerCase() || "";
                                    return userCvText.includes(searchTerm);
                                })
                                .map((applicant, index) => {
                                    const pdfUrl = cvData[applicant.userId]?.pdfUrl;
                                    const userData = applicantNames[applicant.userId] || {};
                                    const cvFilePath = cvUrls[applicant.userId];
                                    return (
                                        <div key={index} className="applicant-cards">
                                            <div className="user-info-own">
                                                <div className="img-box">
                                                    <img src={userData.profilePicUrl} alt="" />
                                                </div>
                                                <div className="info-box">
                                                    <div className="col-lg-3 info-box-user">
                                                        <h5 className="fs-19 mb-0">
                                                            <a className="primary-link" href="#">
                                                                {userData.firstName} {userData.lastName}
                                                            </a>
                                                        </h5>
                                                        <ul className="list-inline mb-0 text-muted mt-3">
                                                            <li className="list-inline-item">
                                                                <i className="mdi mdi-map-marker"></i> {userData.city || "Location unknown"}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                            {pdfUrl && (
                                                <div className="button-box">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                if (!pdfUrl) return;

                                                                // ✅ Extrahera endast filnamnet från URL:en
                                                                const filePath = pdfUrl.replace("https://eebbwtkghyyqjlphiuer.supabase.co/storage/v1/object/public/pdfs/", "");

                                                                // ✅ Hämta filen från Supabase Storage
                                                                const { data, error } = await supabase.storage
                                                                    .from("pdfs")
                                                                    .download(filePath);

                                                                if (error) {
                                                                    console.error("❌ Kunde inte ladda ner PDF:", error);
                                                                    return;
                                                                }

                                                                // Skapa en nedladdningsbar länk
                                                                const url = URL.createObjectURL(data);
                                                                const a = document.createElement("a");
                                                                a.href = url;
                                                                a.download = filePath; // Filnamn som sparas
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                                URL.revokeObjectURL(url);
                                                            } catch (err) {
                                                                console.error("❌ Fel vid nedladdning av PDF:", err);
                                                            }
                                                        }}
                                                        className="btn-download-cv"
                                                    >
                                                        <img
                                                            className="avatar-md img-thumbnail"
                                                            src="https://cdn-icons-png.freepik.com/512/36/36049.png"
                                                            alt="Download Icon"
                                                        />
                                                    </button>

                                                </div>
                                            )}

                                        </div>
                                    );
                                })}
                        </ul>
                        <button className="close-button" onClick={closeModal}>Stäng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationHandler;