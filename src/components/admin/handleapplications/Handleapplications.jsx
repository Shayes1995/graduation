import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import './Handleapplications.css';
import AddPosts from '../addposts/AddPosts';
import Candidate from '../../candidate/Candidate';
import ApplicationHandler from '../applicationsHandler.jsx/Applicationhandler';

const Handleapplications = () => {
    const [applications, setApplications] = useState([]);
    const [activeComponent, setActiveComponent] = useState('addPosts'); 

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const applicationsRef = collection(db, 'applications');
                const querySnapshot = await getDocs(applicationsRef);

                console.log("Applications fetched:", querySnapshot.docs.map(doc => doc.data()));

                const fetchedApplications = [];

                for (const docSnap of querySnapshot.docs) {
                    const applicationData = docSnap.data();

                    // Hämta användarinformation från users collection
                    let userData = null;
                    if (applicationData.userId) {
                        const userDocRef = doc(db, 'users', applicationData.userId);
                        const userDocSnap = await getDoc(userDocRef);

                        if (userDocSnap.exists()) {
                            userData = userDocSnap.data();
                        }
                    }

                    fetchedApplications.push({
                        id: docSnap.id,
                        ...applicationData,
                        user: userData,
                    });
                }

                setApplications(fetchedApplications);
            } catch (error) {
                console.error("Fel vid hämtning av ansökningar:", error);
            }
        };

        fetchApplications();
    }, []);

    const formatDate = (date) => {
        if (!date) return "Okänt datum";
        return typeof date === "string" ? date : new Date(date.seconds * 1000).toLocaleDateString();
    };

    return (
       <div className="applications-handle-container">
        <div className="main-contet-d-row">
            <div className="box-left-links">
                <div className="links-container">
                    <ol>
                        <li>
                            <button className={activeComponent === 'addPosts' ? 'active' : ''} onClick={() => setActiveComponent('addPosts')}>
                                <span>Skapa jobbannons</span>
                            </button>
                        </li>
                        <li>
                            <button className={activeComponent === 'seeAds' ? 'active' : ''} onClick={() => setActiveComponent('seeAds')}>
                                <span>Se mina annonser</span>
                            </button>
                        </li>
                        <li>
                            <button className={activeComponent === 'seeApplications' ? 'active' : ''} onClick={() => setActiveComponent('seeApplications')}>
                                <span>Gå igenom ansökningar</span>
                            </button>
                        </li>
                        <li>
                            <button className={activeComponent === 'seeUsers' ? 'active' : ''} onClick={() => setActiveComponent('seeUsers')}>
                                <span>Se användare</span>
                            </button>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="box-right-content">
                <div className="rendering-box">
                    {activeComponent === 'addPosts' && <AddPosts />}
                    {activeComponent === 'seeUsers' && <Candidate />}
                    {activeComponent === 'seeApplications' && <ApplicationHandler />}
                    {activeComponent === 'seeAds' && <p></p>}
                </div>
            </div>
        </div>
       </div>
    );
};

export default Handleapplications;
