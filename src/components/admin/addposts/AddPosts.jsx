import React, { useState } from 'react';
import { setDoc, doc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase/configfb';
import './AddPosts.css';


const AddPosts = () => {


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

    const [post, setPost] = useState({
        title: '',
        introDesc: '',
        location: '',
        language: '',
        other: '',
        longOrShortTerm: '',
        company: '',
        category: '',
        jobform: '',
        tasks: [],
        startDate: '',
        startDateCal: '',
        deadlineDate: '',
        typeOfAssignment: '',
        description: '',
        detailedDesc: '',
        jobtaskDesc: '',
        keyWords: [],
        offerings: [],
        requirements: [],
        personalTraits: [],
        personalMerits: [],
    });

    //uppdatera state när man skriver i inputfält
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    // uppdate state när man lägger till en punkt
    const handleAddPoint = (field) => {
        setPost({ ...post, [field]: [...post[field], ''] });
    };

    //uppdate state när man ändrar en punkt
    const handlePointChange = (e, index, field) => {
        const newPoints = [...post[field]];
        newPoints[index] = e.target.value;
        setPost({ ...post, [field]: newPoints });
    };

    // ta bort en punkt
    const handleRemovePoint = (index, field) => {
        const newPoints = post[field].filter((_, i) => i !== index);
        setPost({ ...post, [field]: newPoints });
    };

    const handleDeadlineChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Ta bort tid från dagens datum

        if (selectedDate < today) {
            
            setPost({ ...post, deadlineDate: '' }); 
        } else {
            setPost({ ...post, deadlineDate: e.target.value });
        }
    };

    const handleStartDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            
            setPost({ ...post, startDateCal: '' });
        } else {
            setPost({ ...post, startDateCal: e.target.value });
        }
    };

    // skicka formen

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const adminData = JSON.parse(localStorage.getItem('admin'));
            if (!adminData || !adminData.uid) {
                alert('Admin UID saknas! Var vänlig logga in igen.');
                return;
            }

            // Hämta det senaste awid från Firestore först
            const adsRef = collection(db, 'ads');
            const latestAdQuery = query(adsRef, orderBy('awid', 'desc'), limit(1));
            const querySnapshot = await getDocs(latestAdQuery);

            let newAwid = 1000; // startid för första annons-id
            if (!querySnapshot.empty) {
                const latestAd = querySnapshot.docs[0].data();
                newAwid = latestAd.awid + 1; // Öka med 1
            }

           
            const newAdRef = doc(adsRef);
            const firebaseUID = newAdRef.id;

         //inaktivering av de som innehåller tomma strängar som välj
            const normalizeField = (value) => (value === "" || value.includes("Välj")) ? "" : value;

            const jobData = {
                ...post,
                awid: newAwid,
                firebaseUID: firebaseUID,
                adminUid: adminData.uid,
                createdAt: new Date(),
                deadlineDate: post.deadlineDate ? new Date(post.deadlineDate) : null,
                startDateCal: post.startDateCal ? new Date(post.startDateCal) : null,
                category: normalizeField(post.category),
                typeOfAssignment: normalizeField(post.typeOfAssignment),
                jobform: normalizeField(post.jobform),
                longOrShortTerm: normalizeField(post.longOrShortTerm),
                language: normalizeField(post.language),
                other: normalizeField(post.other),
            };

            await setDoc(newAdRef, jobData);

            alert('Jobbannons skapad!');

            setPost({
                title: '',
                introDesc: '',
                location: '',
                company: '',
                category: '',
                jobform: '',
                tasks: [],
                startDate: '',
                longOrShortTerm: '',
                typeOfAssignment: '',
                description: '',
                jobtaskDesc: '',
                detailedDesc: '',
                keyWords: [],
                offerings: [],
                requirements: [],
                personalTraits: [],
                personalMerits: [],
            });

        } catch (error) {
            console.error('❌ Error creating job post:', error);
            alert('Något gick fel! Försök igen.');
        }
    };




    return (
        <div className="addpostspage-container">
            <div className="addpostsform-container">
                <form className='form-add-post' onSubmit={handleSubmit}>
                    {/* Titel */}
                    <div className="df-rw">
                        <div className="box-form-post">
                            <div className="form-group">
                                <label htmlFor="title">Titel</label>
                                <input type="text" className="form-control" id="title" name="title" placeholder="Ange titel" value={post.title} onChange={handleChange} required />
                            </div>

                            {/* Kort beskrivning */}
                            <div className="form-group">
                                <label htmlFor="introDesc">Kort beskrivning</label>
                                <textarea className="form-control" id="introDesc" name="introDesc" rows="3" placeholder="En kort introduktion till rollen" value={post.introDesc} onChange={handleChange} required ></textarea>
                            </div>

                            {/* Plats, kategori, omfattning, startdatum, typ av uppdrag */}
                            <div className="df-rw-comp">
                                <div className="form-group small-input">
                                    <label htmlFor="location">Plats:</label>
                                    <input type="text" className="form-control" id="location" name="location" value={post.location} onChange={handleChange} required />
                                </div>
                                <div className="form-group small-input">
                                    <label htmlFor="startDate">Startdatum:</label>
                                    <input type="text" className="form-control" id="startDate" name="startDate" value={post.startDate} onChange={handleChange}  />
                                </div>
                                <div className="form-group small-input">
                                    <label htmlFor="company">Företag:</label>
                                    <input type="text" className="form-control" id="company" name="company" value={post.company} onChange={handleChange} />
                                </div>

                            </div>
                            <div className="form-group">
                                <label htmlFor="deadlineDate">Sista ansökningsdag</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="deadlineDate"
                                    name="deadlineDate"
                                    value={post.deadlineDate}
                                    onChange={handleDeadlineChange}
                                    
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deadlineDate">Pågår till och med</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="startDateCal"
                                    name="startDateCal"
                                    value={post.startDateCal}
                                    onChange={handleStartDateChange}
                            
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="detailedDesc">Detaljerad beskrivning</label>
                                <textarea className="form-control" id="detailedDesc" name="detailedDesc" rows="5" value={post.detailedDesc} onChange={handleChange} ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="jobtaskDesc">Arbetsbeskrivning</label>
                                <textarea className="form-control" id="jobtaskDesc" name="jobtaskDesc" rows="5" value={post.jobtaskDesc} onChange={handleChange}  ></textarea>
                            </div>
                        </div>

                        <div className="box-form-post">
                            <div className="d-row-option">
                                <div className="form-group">
                                    <label htmlFor="category">Jobbkategori</label>
                                    <select id="category" name="category" value={post.category} onChange={handleChange} required>
                                        <option value="">Välj kategori</option>
                                        {jobCategories.map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="typeOfAssignment">Typ av uppdrag</label>
                                    <select id="typeOfAssignment" name="typeOfAssignment" value={post.typeOfAssignment} onChange={handleChange} required>
                                        <option value="">Välj typ av uppdrag</option>
                                        {typeOfAssignments.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="jobform">Omfattning</label>
                                    <select id="jobform" name="jobform" value={post.jobform} onChange={handleChange} >
                                        <option value="">Välj omfattning</option>
                                        {jobScopes.map((scope, index) => (
                                            <option key={index} value={scope}>{scope}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="longOrShortTerm">Långt eller kortsiktigt</label>
                                    <select id="longOrShortTerm" name="longOrShortTerm" value={post.longOrShortTerm} onChange={handleChange} >
                                        <option value="">Välj ett val</option>
                                        {longOrShortTerm.map((scope, index) => (
                                            <option key={index} value={scope}>{scope}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="language">Språk</label>
                                    <select id="language" name="language" value={post.language} onChange={handleChange} >
                                        <option value="">Välj språk</option>
                                        {languages.map((lang, index) => (
                                            <option key={index} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="other">Övrigt</label>
                                    <select id="other" name="other" value={post.other} onChange={handleChange}>
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
                                    {post.tasks.map((point, index) => (
                                        <div className="group">
                                            <li key={index}>
                                                <input type="text" value={point} onChange={(e) => handlePointChange(e, index, 'tasks')} placeholder="Lägg till punkt" />
                                                <button type="button" onClick={() => handleRemovePoint(index, 'tasks')}>
                                                    Ta bort
                                                </button>
                                            </li>
                                        </div>
                                    ))}
                                </ul>
                                <button className='light' type="button" onClick={() => handleAddPoint('tasks')}>
                                    Lägg till punkt
                                </button>
                            </div>
                            <div className="form-group">
                                <label>Nyckelord för annons</label>
                                <ul>
                                    {post.keyWords.map((point, index) => (
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
                                    {post.offerings.map((point, index) => (
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
                                    {post.requirements.map((point, index) => (
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
                                    {post.personalMerits.map((point, index) => (
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
                                    {post.personalTraits.map((point, index) => (
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
                    <div className="btn-group">
                        <button type="submit" className="light">
                            Skapa Jobbannons
                        </button>
                    </div>

                </form >
            </div >
        </div >
    );
};

export default AddPosts;
