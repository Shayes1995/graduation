import React, { useState } from 'react';
import './AddPosts.css';


const AddPosts = () => {
    const [post, setPost] = useState({
        title: '',
        introDesc: '',
        location: '',
        category: '',
        jobform: '',
        startDate: '',
        typeOfAssignment: '',
        description: '',
        detailedDesc: '',
        keyWords: [],
        offerings: [],
        requirements: [],
        personalTraits: [],
    });

    //uppdatera state när användaren skriver i inputfält
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    // uppdate state när användaren lägger till en punkt
    const handleAddPoint = (field) => {
        setPost({ ...post, [field]: [...post[field], ''] });
    };

    //uppdate state när användaren ändrar en punkt
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

    // Funktion för att skicka formuläret
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Job Post:', post);
        alert('Jobbannons skapad!');
    };

    return (
        <div className="addpostspage-container">
            <div className="addpostsform-container">
                <h2>Lägg upp en Jobbannons</h2>
                <form onSubmit={handleSubmit}>
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
                                    <label htmlFor="category">Jobbkategori:</label>
                                    <input type="text" className="form-control" id="location" name="category" value={post.category} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="df-rw-comp">
                                <div className="form-group small-input">
                                    <label htmlFor="jobform">Omfattning:</label>
                                    <input type="text" className="form-control" id="jobform" name="jobform" value={post.jobform} onChange={handleChange} required />
                                </div>
                                <div className="form-group small-input">
                                    <label htmlFor="startDate">Startdatum:</label>
                                    <input type="text" className="form-control" id="startDate" name="startDate" value={post.startDate} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="df-rw-comp">
                                <div className="form-group small-input">
                                    <label htmlFor="typeOfAssignment">Typ av uppdrag:</label>
                                    <input type="text" className="form-control" id="typeOfAssignment" name="typeOfAssignment" value={post.typeOfAssignment} onChange={handleChange} required />
                                </div>

                                <div className="form-group small-input">
                                    <label htmlFor="typeOfAssignment">Typ av uppdrag:</label>
                                    <input type="text" className="form-control" id="typeOfAssignment" name="typeOfAssignment" value={post.typeOfAssignment} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="box-form-post">

                            <div className="form-group">
                                <label htmlFor="detailedDesc">Detaljerad beskrivning</label>
                                <textarea className="form-control" id="detailedDesc" name="detailedDesc" rows="5" value={post.detailedDesc} onChange={handleChange} required ></textarea>
                            </div>

                            {/* lista: Vad du erbjuds */}
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
                                <button type="button" onClick={() => handleAddPoint('offerings')}>
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
                                <button type="button" onClick={() => handleAddPoint('requirements')}>
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
                                <button type="button" onClick={() => handleAddPoint('personalTraits')}>
                                    Lägg till punkt
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Skapa Jobbannons
                    </button>
                </form >
            </div >
        </div >
    );
};

export default AddPosts;
