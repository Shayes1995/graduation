import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { Query } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/configfb';
import './Adslist.css';
import './AdsModal.css';
import { FaRegHeart } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsBell } from "react-icons/bs";
import AdsModal from './AdsModal';

const Adslist = () => {
    const [ads, setAds] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTaskTypes, setSelectedTaskTypes] = useState([]);
    const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedOtherOptions, setSelectedOtherOptions] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedAd, setSelectedAd] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const navigate = useNavigate();

    const handleAdClick = (ad) => {
        setSelectedAd(ad);
        setShowModal(true);
    };

    // Funktion för att hämta annonser 
    const fetchAds = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'ads'));
            const adsList = querySnapshot.docs.map(doc => {
                const adData = doc.data();
                return {
                    id: doc.id,
                    ...adData,
                    createdAt: adData.createdAt?.toDate().toLocaleDateString() || 'Okänt datum',
                };
            });
            setAds(adsList);
            setFilteredAds(adsList);
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    };

    const getImageForCategory = (category) => {
        switch (category?.toLowerCase()) {
            case 'it':
                return 'https://cdn.academicwork.com/business-areas/system_developer.png';
            case 'finance':
                return 'https://cdn.academicwork.com/business-areas/finance.png';
            case 'marketing':
                return 'https://cdn.academicwork.com/business-areas/marketing.png';
            default:
                return 'https://cdn.academicwork.com/business-areas/default.png';
        }
    };

    //hämtning av alla annonser
    useEffect(() => {
        fetchAds();
    }, []);

    useEffect(() => {
        if (selectedAd) {
            checkIfApplied();
        }
    }, [selectedAd]);

    // för filtrering av annonser
    useEffect(() => {
        let filtered = ads;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(ad => selectedCategories.includes(ad.category));
        }

        if (selectedTaskTypes.length > 0) {
            filtered = filtered.filter(ad => selectedTaskTypes.includes(ad.typeOfAssignment));
        }

        if (selectedEmploymentTypes.length > 0) {
            filtered = filtered.filter(ad => selectedEmploymentTypes.includes(ad.jobform));
        }

        if (selectedLanguages.length > 0) {
            filtered = filtered.filter(ad => selectedLanguages.includes(ad.language));
        }

        if (selectedOtherOptions.length > 0) {
            filtered = filtered.filter(ad => selectedOtherOptions.includes(ad.other));
        }

        setFilteredAds(filtered);
    }, [selectedCategories, selectedTaskTypes, selectedEmploymentTypes, selectedLanguages, selectedOtherOptions, ads]);

    // Funktion för checkboxes
    const handleCheckboxChange = (event, setState) => {
        const value = event.target.value;
        setState(prev =>
            prev.includes(value)
                ? prev.filter(option => option !== value)
                : [...prev, value]
        );
    };

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
    };

    const checkIfApplied = async () => {
        const auth = getAuth();
        const user = auth.currentUser || JSON.parse(localStorage.getItem('user'));

        if (!user) return;

        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where("userId", "==", user.uid), where("adId", "==", selectedAd.id));
        const querySnapshot = await getDocs(q);

        setHasApplied(!querySnapshot.empty);
    };

    const handleApply = async () => {
        if (!selectedAd) return;

        try {
            const auth = getAuth();
            const user = auth.currentUser || JSON.parse(localStorage.getItem('user'));


            if (!user) {
                console.log('logga in')
                navigate('/login');
                return;
            }

            const applicationRef = doc(collection(db, 'applications'));

            const applicationData = {
                userId: user.uid,
                adId: selectedAd.id,
                adminId: selectedAd.adminUid || "Unknown",
                title: selectedAd.title,
                location: selectedAd.location,
                category: selectedAd.category,
                jobform: selectedAd.jobform,
                startDate: selectedAd.startDate,
                typeOfAssignment: selectedAd.typeOfAssignment,
                createdAt: new Date(),
            };

            await setDoc(applicationRef, applicationData);

            console.log('skickad annons')
            setHasApplied(true);
            setShowModal(false);
        } catch (error) {
            console.error("Fel vid ansökan:", error);

        }
    };


    return (
        <div className='main-home'>
            <div className="round-up">
                <div className="top-page">
                    <div className="top-box">
                        <h1>Sök bland {ads.length} lediga jobb</h1>
                        <div className="input-group-search">
                            <input type="text" placeholder='Titel, jobbkategori, företag, nyckelord' />
                            <input type="text" placeholder='Län, stad, kommun, område' />
                            <button className='search-btn'>
                                Sök <IoIosSearch />
                            </button>
                        </div>

                        {/* Dropdowns */}
                        <div className="row-selects">
                            <div className="select-group">
                                <button onClick={() => toggleDropdown('taskType')}>
                                    Typ av uppdrag <MdKeyboardArrowDown />
                                </button>
                                <div className={`dropdown-content ${openDropdown === 'taskType' ? 'show' : ''}`}>
                                    {['Rekrytering', 'Konsultuppdrag'].map(option => (
                                        <div className="box-check" key={option}>
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                value={option}
                                                checked={selectedTaskTypes.includes(option)}
                                                onChange={(e) => handleCheckboxChange(e, setSelectedTaskTypes)}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="select-group">
                                <button onClick={() => toggleDropdown('employmentType')}>
                                    Omfattning <MdKeyboardArrowDown />
                                </button>
                                <div className={`dropdown-content ${openDropdown === 'employmentType' ? 'show' : ''}`}>
                                    {['Heltid', 'Deltid'].map(option => (
                                        <div className="box-check" key={option}>
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                value={option}
                                                checked={selectedEmploymentTypes.includes(option)}
                                                onChange={(e) => handleCheckboxChange(e, setSelectedEmploymentTypes)}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="select-group">
                                <button onClick={() => toggleDropdown('category')}>
                                    Kategori <MdKeyboardArrowDown />
                                </button>
                                <div className={`dropdown-content ${openDropdown === 'category' ? 'show' : ''}`}>
                                    {[
                                        "Kundservice", "Utbildning", "Hotell", "Restaurang", "Turism", "IT",
                                        "Industri", "Tillverkning", "Marknadsföring", "Information", "Media",
                                        "HR", "Kontor", "Administration", "Övrigt", "Försäljning", "Teknik",
                                        "Lager", "Logistik", "Ekonomi", "Juridik", "Inköp"
                                    ].map(option => (
                                        <div className="box-check" key={option}>
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                value={option}
                                                checked={selectedCategories.includes(option)}
                                                onChange={(e) => handleCheckboxChange(e, setSelectedCategories)}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="select-group">
                                <button onClick={() => toggleDropdown('otherOptions')}>
                                    Övrigt <MdKeyboardArrowDown />
                                </button>
                                <div className={`dropdown-content ${openDropdown === 'otherOptions' ? 'show' : ''}`}>
                                    {['Trainee', 'Sommarjobb', 'Internt på Academic Work', 'Kortare jobbuppdrag', 'Frilansuppdrag', 'Gröna jobb', 'Utbildning'].map(option => (
                                        <div className="box-check" key={option}>
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                value={option}
                                                checked={selectedOtherOptions.includes(option)}
                                                onChange={(e) => handleCheckboxChange(e, setSelectedOtherOptions)}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="select-group">
                                <button onClick={() => toggleDropdown('language')}>
                                    Språk <MdKeyboardArrowDown />
                                </button>
                                <div className={`dropdown-content ${openDropdown === 'language' ? 'show' : ''}`}>
                                    {['Svenska', 'Engelska'].map(option => (
                                        <div className="box-check" key={option}>
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                value={option}
                                                checked={selectedLanguages.includes(option)}
                                                onChange={(e) => handleCheckboxChange(e, setSelectedLanguages)}
                                            />
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="top-page">
                        <div className="top-box small-box">
                            <div className="info-content">
                                <h4>Håll dig uppdaterad</h4>
                                <p>Skapa en jobbevakning och bli meddelad när vi publicerar nya jobb som matchar din profil.</p>
                            </div>
                            <div className="info-content">
                                <button>
                                    Bevaka
                                    <BsBell className='icon-bell' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="top-rows">
                    <button className='amount-btn'>
                        <strong>{filteredAds.length}</strong> Träffar
                    </button>
                    <button className='saved-btn'>
                        0 Sparade
                    </button>
                </div>

                {/* Jobbannonser */}
                <div className="ads-listing">
                    <div className="bottom-row">
                        {filteredAds.length > 0 ? (
                            <div className='card'>
                                {filteredAds.map(ad => (
                                    <div className='job-box' key={ad.id} onClick={() => handleAdClick(ad)}>
                                        <div className="all-card-container">
                                            <div className="left-side">
                                                <div className="img-box">
                                                    <img src={getImageForCategory(ad.category)} alt={`${ad.category} logo`} />
                                                </div>
                                                <div className="job-information">
                                                    <h2>{ad.title}</h2>
                                                    <p>{ad.location}</p>
                                                    <p>{ad.jobform}</p>
                                                    <p className='light-text'>Publicerad {ad.createdAt}</p>
                                                </div>
                                            </div>
                                            <div className="button-save">
                                                <FaRegHeart />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Inga annonser tillgängliga.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal för att visa information om den valda annonsen */}
            <AdsModal
                show={showModal}
                onClose={() => setShowModal(false)}
            >
                {selectedAd ? (
                    <div className='ad-container-specific'>
                        <div className="specific-content">
                            <div className="header-h1">
                                <h1 className='header-modal'>{selectedAd.title}</h1>
                            </div>
                            <div className="introDesc">
                                <p>
                                    {selectedAd.introDesc}
                                </p>
                                <div className="button-modal">
                                    <button
                                        className={`apply-btn ${hasApplied ? 'disabled' : ''}`}
                                        onClick={!hasApplied ? handleApply : null}
                                        disabled={hasApplied}
                                    >
                                        {hasApplied ? "Redan ansökt" : "Ansök"}
                                    </button>
                                    <button className='save-btn'>
                                        Spara
                                        <FaRegHeart className='modal-icon' />
                                    </button>
                                </div>
                            </div>
                            <div className="location-info">
                                <div className="info-box-modal">
                                    <p><strong>Plats:</strong> {selectedAd.location}</p>
                                    <p><strong>Jobbkategori:</strong> {selectedAd.category}</p>
                                    <p><strong>Omfattning:</strong> {selectedAd.jobform}</p>
                                </div>
                                <div className="info-box-modal">
                                    <p><strong>Startdatum:</strong> {selectedAd.startDate}</p>
                                    <p><strong>Typ av uppdrag:</strong> {selectedAd.typeOfAssignment}</p>
                                </div>
                            </div>
                            <div className="about-job">
                                <h2>Om tjänsten</h2>
                                <p>{selectedAd.detailedDesc}</p>
                            </div>
                            {selectedAd.offerings && selectedAd.offerings.length > 0 ? (
                                <div className="about-job">
                                    <h2>Kvalifikationer</h2>
                                    <p>{selectedAd.offerings}</p>
                                </div>
                            ) : (
                                null
                            )}
                            <div className="about-job">
                                <h2>Arbetsuppgifter</h2>
                                <p>
                                    {selectedAd.jobtaskDesc}
                                </p>
                                <ul>
                                    {selectedAd.tasks.map((task, index) => (
                                        <li className='li-modal' key={index}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="about-job">
                                <h2>Vi söker dig som</h2>
                                <ul>
                                    {selectedAd.requirements.map((task, index) => (
                                        <li className='li-modal' key={index}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                            {selectedAd.personalMerits && selectedAd.personalMerits.length > 0 ? (
                                <div className="about-job">
                                    <h3>Det är meriterande om du</h3>
                                    <ul>
                                        {selectedAd.personalMerits.map((task, index) => (
                                            <li className='li-modal' key={index}>{task}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                null
                            )}
                            {selectedAd.personalTraits && selectedAd.personalTraits.length > 0 ? (
                                <div className="about-job">
                                    <h3>För att lyckas i rollen har du följande personliga egenskaper</h3>
                                    <ul>
                                        {selectedAd.personalTraits.map((task, index) => (
                                            <li className='li-modal' key={index}>{task}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                null
                            )}

                            <div className="">
                                <div className="button-modal">
                                    <button
                                        className={`apply-btn ${hasApplied ? 'disabled' : ''}`}
                                        onClick={!hasApplied ? handleApply : null}
                                        disabled={hasApplied}
                                    >
                                        {hasApplied ? "Redan ansökt" : "Ansök"}
                                    </button>
                                    <button className='save-btn'>
                                        Spara
                                        <FaRegHeart className='modal-icon' />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <p>Laddar annonsinformation...</p>
                )}
            </AdsModal>
        </div>
    );
};

export default Adslist;
