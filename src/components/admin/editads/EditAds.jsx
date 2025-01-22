import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import './EditAds.css';

const EditAds = () => {
    const [ads, setAds] = useState([]);
    const [selectedAd, setSelectedAd] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const adminData = JSON.parse(localStorage.getItem('admin'));


    const jobCategories = [
        'Kundservice', 'Utbildning', 'Hotell', 'Restaurang', 'Turism', 'IT',
        'Industri', 'Tillverkning', 'Marknadsföring', 'Information', 'Media',
        'HR', 'Kontor', 'Administration', 'Försäljning', 'Teknik', 'Lager',
        'Logistik', 'Ekonomi', 'Juridik', 'Inköp'
    ];

    const typeOfAssignments = ['Rekrytering', 'Konsultuppdrag'];
    const jobScopes = ['Heltid', 'Deltid'];
    const languages = ['Svenska', 'Engelska'];
    const otherOptions = ['Trainee', 'Sommarjobb', 'Internt på Academic Work', 'Kortare jobbuppdrag', 'Frilansuppdrag', 'Gröna jobb', 'Utbildning'];
    const longOrShortTerm = ['långsiktigt', 'kortsiktigt'];


    useEffect(() => {
        if (!adminData || !adminData.uid) {
            console.error("Ingen admin UID hittad.");
            return;
        }

        const fetchAds = async () => {
            try {
                const q = query(collection(db, 'ads'), where('adminUid', '==', adminData.uid));
                const querySnapshot = await getDocs(q);

                const adsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setAds(adsList);
            } catch (error) {
                console.error("Fel vid hämtning av annonser:", error);
            }
        };

        fetchAds();
    }, [adminData]);

    const openEditModal = (ad) => {
        setSelectedAd(ad);
        setShowModal(true);
    };

    const handleDelete = async (adId) => {
        if (!window.confirm("Är du säker på att du vill ta bort denna annons?")) return;

        try {
            await deleteDoc(doc(db, 'ads', adId));
            setAds(prevAds => prevAds.filter(ad => ad.id !== adId));
            alert("Annons borttagen!");
        } catch (error) {
            console.error("Fel vid borttagning av annons:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault(); 

        if (!selectedAd || !selectedAd.id) return;

        try {
            const adRef = doc(db, 'ads', selectedAd.id);
            await updateDoc(adRef, selectedAd);
            alert("Annons uppdaterad!");


            setAds(prevAds => prevAds.map(ad => ad.id === selectedAd.id ? selectedAd : ad));
            setShowModal(false);
        } catch (error) {
            console.error("Fel vid uppdatering av annons:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedAd(prevState => ({ ...prevState, [name]: value }));
    };

 
    const handlePointChange = (e, index, field) => {
        const updatedList = [...selectedAd[field]];
        updatedList[index] = e.target.value;
        setSelectedAd(prevState => ({ ...prevState, [field]: updatedList }));
    };

    const handleAddPoint = (field) => {
        setSelectedAd(prevState => ({ ...prevState, [field]: [...prevState[field], ''] }));
    };

    const handleRemovePoint = (index, field) => {
        const updatedList = selectedAd[field].filter((_, i) => i !== index);
        setSelectedAd(prevState => ({ ...prevState, [field]: updatedList }));
    };

    return (
        <div className="edit-ads-container">
            <h2>Mina annonser</h2>
            {ads.length > 0 ? (
                <div className="ads-list">
                    {ads.map(ad => (
                        <div key={ad.id} className="ad-card">
                            <h3>{ad.title}</h3>
                            <p>Plats: {ad.location}</p>
                            <p>Kategori: {ad.category}</p>
                            <p>Startdatum: {ad.startDate}</p>
                            <button className="edit-btn" onClick={() => openEditModal(ad)}>Redigera</button>
                            <button className="delete-btn" onClick={() => handleDelete(ad.id)}>Ta bort</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Du har inga annonser att redigera.</p>
            )}

            {/*Modal för redigering */}
            {showModal && selectedAd && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Redigera Annons</h2>
                        <form onSubmit={handleSave} className='form-edit-ads'>

                            <div className="df-rw">
                                <div className="box-form-post">
                                    <div className="form-group">
                                        <label>Titel:</label>
                                        <input type="text" name="title" value={selectedAd.title} onChange={handleChange} />
                                    </div>

                                    {/* Kort beskrivning */}
                                    <div className="form-group">
                                        <label htmlFor="introDesc">Kort beskrivning</label>
                                        <textarea className="form-control" id="introDesc" name="introDesc" rows="3" placeholder="En kort introduktion till rollen" value={selectedAd.introDesc} onChange={handleChange} required ></textarea>
                                    </div>

                                    {/* Plats, kategori, omfattning, startdatum, typ av uppdrag */}
                                    <div className="df-rw-comp">
                                        <div className="form-group small-input">
                                            <label htmlFor="location">Plats:</label>
                                            <input type="text" className="form-control" id="location" name="location" value={selectedAd.location} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group small-input">
                                            <label htmlFor="startDate">Startdatum:</label>
                                            <input type="text" className="form-control" id="startDate" name="startDate" value={selectedAd.startDate} onChange={handleChange} />
                                        </div>
                                        <div className="form-group small-input">
                                            <label htmlFor="company">Företag:</label>
                                            <input type="text" className="form-control" id="company" name="company" value={selectedAd.company} onChange={handleChange} />
                                        </div>

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="deadlineDate">Sista ansökningsdag</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="deadlineDate"
                                            name="deadlineDate"
                                            value={selectedAd.deadlineDate}
                                            onChange={handleChange}

                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="deadlineDate">Pågår till och med</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="startDateCal"
                                            name="startDateCal"
                                            value={selectedAd.startDateCal}
                                            onChange={handleChange}

                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="detailedDesc">Detaljerad beskrivning</label>
                                        <textarea className="form-control" id="detailedDesc" name="detailedDesc" rows="5" value={selectedAd.detailedDesc} onChange={handleChange} ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="jobtaskDesc">Arbetsbeskrivning</label>
                                        <textarea className="form-control" id="jobtaskDesc" name="jobtaskDesc" rows="5" value={selectedAd.jobtaskDesc} onChange={handleChange}  ></textarea>
                                    </div>
                                </div>

                                <div className="box-form-post">
                                    <div className="d-row-option">
                                        <div className="form-group">
                                            <label htmlFor="category">Jobbkategori</label>
                                            <select id="category" name="category" value={selectedAd.category} onChange={handleChange} required>
                                                <option value="">Välj kategori</option>
                                                {jobCategories.map((cat, index) => (
                                                    <option key={index} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="typeOfAssignment">Typ av uppdrag</label>
                                            <select id="typeOfAssignment" name="typeOfAssignment" value={selectedAd.typeOfAssignment} onChange={handleChange} required>
                                                <option value="">Välj typ av uppdrag</option>
                                                {typeOfAssignments.map((type, index) => (
                                                    <option key={index} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="jobform">Omfattning</label>
                                            <select id="jobform" name="jobform" value={selectedAd.jobform} onChange={handleChange} >
                                                <option value="">Välj omfattning</option>
                                                {jobScopes.map((scope, index) => (
                                                    <option key={index} value={scope}>{scope}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-row-option">
                                        <div className="form-group">
                                            <label htmlFor="longOrShortTerm">Långt eller kortsiktigt</label>
                                            <select id="longOrShortTerm" name="longOrShortTerm" value={selectedAd.longOrShortTerm} onChange={handleChange} >
                                                <option value="">Välj ett val</option>
                                                {longOrShortTerm.map((scope, index) => (
                                                    <option key={index} value={scope}>{scope}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="language">Språk</label>
                                            <select id="language" name="language" value={selectedAd.language} onChange={handleChange} >
                                                <option value="">Välj språk</option>
                                                {languages.map((lang, index) => (
                                                    <option key={index} value={lang}>{lang}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="other">Övrigt</label>
                                            <select id="other" name="other" value={selectedAd.other} onChange={handleChange}>
                                                <option value="">Välj ett alternativ</option>
                                                {otherOptions.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* lista: Vad du ska göra */}
                                    <div className="form-group">
                                        <label>Arbetsuppgifter</label>
                                        <ul>
                                            {selectedAd.tasks.map((task, index) => (
                                                <div className="group">
                                                    <li key={index}>
                                                        <input type="text" value={task} onChange={(e) => handlePointChange(e, index, 'tasks')} />
                                                        <button type="button" onClick={() => handleRemovePoint(index, 'tasks')}>Ta bort</button>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                        <button className='light' type="button" onClick={() => handleAddPoint('tasks')}>Lägg till punkt</button>
                                    </div>
                                    <div className="form-group">
                                        <label>Nyckelord för annons</label>
                                        <ul>
                                            {selectedAd.keyWords.map((point, index) => (
                                                <div className="group">
                                                    <li key={index}>
                                                        <input type="text" value={point} onChange={(e) => handlePointChange(e, index, 'keyWords')} placeholder="Lägg till punkt" />
                                                        <button type="button" onClick={() => handleRemovePoint(index, 'keyWords')}>
                                                            Ta bort
                                                        </button>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                        <button className='light' type="button" onClick={() => handleAddPoint('keyWords')}>
                                            Lägg till punkt
                                        </button>
                                    </div>
                                    <div className="form-group">
                                        <label>Vad du erbjuds</label>
                                        <ul>
                                            {selectedAd.offerings.map((point, index) => (
                                                <div className="group">
                                                    <li key={index}>
                                                        <input type="text" value={point} onChange={(e) => handlePointChange(e, index, 'offerings')} placeholder="Lägg till punkt" />
                                                        <button type="button" onClick={() => handleRemovePoint(index, 'offerings')}>
                                                            Ta bort
                                                        </button>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                        <button className='light' type="button" onClick={() => handleAddPoint('offerings')}>
                                            Lägg till punkt
                                        </button>
                                    </div>

                                    {/* lista: Vi söker dig som */}
                                    <div className="form-group">
                                        <label>Vi söker dig som</label>
                                        <ul>
                                            {selectedAd.requirements.map((point, index) => (
                                                <div className="group">
                                                    <li key={index}>
                                                        <input type="text" value={point} onChange={(e) => handlePointChange(e, index, 'requirements')} placeholder="Lägg till punkt" />
                                                        <button type="button" onClick={() => handleRemovePoint(index, 'requirements')}>
                                                            Ta bort
                                                        </button>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                        <button className='light' type="button" onClick={() => handleAddPoint('requirements')}>
                                            Lägg till punkt
                                        </button>
                                    </div>

                                    {/* lista: meriterande */}
                                    <div className="form-group">
                                        <label>Meriterande egenskaper</label>
                                        <ul>
                                            {selectedAd.personalMerits.map((point, index) => (
                                                <div className="group">
                                                    <li key={index}>
                                                        <input type="text" value={point} onChange={(e) => handlePointChange(e, index, 'personalMerits')} placeholder="Lägg till punkt" />
                                                        <button type="button" onClick={() => handleRemovePoint(index, 'personalMerits')}>
                                                            Ta bort
                                                        </button>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                        <button className='light' type="button" onClick={() => handleAddPoint('personalMerits')}>
                                            Lägg till punkt
                                        </button>
                                    </div>


                                    {/* lista: För att lyckas i rollen */}
                                    <div className="form-group">
                                        <label>För att lyckas i rollen har du följande personliga egenskaper</label>
                                        <ul>
                                            {selectedAd.personalTraits.map((point, index) => (
                                                <div className="group">
                                                    <li key={index}>
                                                        <input
                                                            type="text" value={point} onChange={(e) => handlePointChange(e, index, 'personalTraits')} placeholder="Lägg till punkt" />
                                                        <button type="button" onClick={() => handleRemovePoint(index, 'personalTraits')}>
                                                            Ta bort
                                                        </button>
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                        <button className='light' type="button" onClick={() => handleAddPoint('personalTraits')}>
                                            Lägg till punkt
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="save-btn">Spara</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Avbryt</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditAds;
