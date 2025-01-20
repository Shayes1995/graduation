import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/configfb';
import emailjs from "@emailjs/browser";

import './Candidate.css';
import Admin from '../../pages/Admin';

const Candidate = () => {
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (keyword.trim() && !keywords.includes(keyword.trim().toLowerCase())) {
      setKeywords([...keywords, keyword.trim().toLowerCase()]);
      setKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };

  const handleSearch = async () => {
    if (keywords.length === 0) return;

    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const filteredUsers = users.filter((user) => {
      const userKeywords = [
        user.firstName?.toLowerCase() || "",
        user.lastName?.toLowerCase() || "",
        user.city?.toLowerCase() || "",
        ...(user.skills || []).map((skill) => skill.toLowerCase()),
      ];
      return keywords.some((k) =>
        userKeywords.some((userKeyword) => userKeyword.includes(k))
      );
    });

    setResults(filteredUsers);
  };

  const fetchUsersEffect = async () => {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setResults(users);
  }

  useEffect(() => {
    fetchUsersEffect();
  }, []);



  const sendEmailNotification = async (userEmail) => {
    try {
      const templateParams = {
        email_to: userEmail,
        message: "Du har ett nytt meddelande i ditt konto på AW Talent, logga in för att se det!",
      };

      await emailjs.send(
        "service_hl7um1p", 
        "template_tjpbtzh", 
        templateParams,
        "3ZnbOARiW9qmNJMeI" 
      );

      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedCandidate || !message.trim()) return;
  
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (!adminData || !adminData.uid) {
      alert("Admin UID not found.");
      return;
    }
  
    const adminUid = adminData.uid;
    const userUid = selectedCandidate.id;
    const userEmail = selectedCandidate.email; // Förväntar att användaren har en `email`-egenskap
  
    try {
      const conversationId = adminUid < userUid ? `${adminUid}_${userUid}` : `${userUid}_${adminUid}`;
      const conversationRef = doc(db, "messages", conversationId);
  
      const conversationSnap = await getDoc(conversationRef);
  
      if (conversationSnap.exists()) {
        await updateDoc(conversationRef, {
          messages: [
            ...conversationSnap.data().messages,
            {
              senderId: adminUid,
              receiverId: userUid,
              message,
              timestamp: new Date(),
            },
          ],
        });
      } else {
        await setDoc(conversationRef, {
          participants: [adminUid, userUid],
          messages: [
            {
              senderId: adminUid,
              receiverId: userUid,
              message,
              timestamp: new Date(),
            },
          ],
        });
      }
  
      // Skicka e-post till användaren
      await sendEmailNotification(userEmail);
  
      setMessage("");
      setShowMessageModal(false);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    }
  };
  

  return (
    <section className="section homePage">
      <div className="candidatePage">
        <div className="candidate-list-widgets">
          <form className='form-candidate' onSubmit={handleAddKeyword}>
            <div className="d-arow">
              <div className="filler-job-form">
                <i className="uil uil-briefcase-alt"></i>
                <input
                  id=""
                  placeholder="Enter keywords (e.g., name, city, skill)"
                  type="search"
                  className="input-search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="div-btn">
                <div className="searchDiv">
                  <button type="submit" className="button-candidate">
                    <i className="uil uil-filter"></i> Ange sökord
                  </button>
                  <button onClick={handleSearch} className="button-candidate">
                    Sök
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="keywords-list">
            {keywords.map((k, index) => (
              <span key={index} className="badge bg-secondary m-1">
                {k}
                <button
                  type="button"
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => handleRemoveKeyword(k)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="candidate-list">
            <p className='results-p'>
              {results.length} träffar
            </p>
            {results.length > 0 ? (
              results.map((user, index) => (
                <div
                  key={index}
                  className="candidate-list-box bookmark-post card"
                >
                  <div className="card-body">
                    <div className="align-items-center row">
                      <div className="col-auto">
                        <div className="candidate-list-images">
                          <a href="#">
                            <img
                              src={
                                user.profilePicUrl ||
                                "https://bootdey.com/img/Content/avatar/avatar2.png"
                              }
                              alt="User Avatar"
                              className="avatar-md img-thumbnail rounded-circle"
                            />
                          </a>
                        </div>
                        <button
                            className="btn btn-secondary nav-link active"
                            onClick={() => {
                              console.log('Selected candidate:', user); // Debug log
                              setSelectedCandidate(user);
                              setShowMessageModal(true);
                            }}
                          >
                            Skicka meddelande
                          </button>
                      </div>
                      <div className="col-lg-3">
                        <div className="candidate-list-content mt-3 mt-lg-0">
                          <h5 className="fs-19 mb-0">
                            <a className="primary-link" href="#">
                              {user.firstName} {user.lastName}
                            </a>
                            <span className="badge bg-warning ms-1">
                              <i className="mdi mdi-star align-middle"></i>
                              {user.rating || "N/A"}
                            </span>
                          </h5>
                          <ul className="list-inline mb-0 text-muted mt-3">
                            <li className="list-inline-item">
                              <i className="mdi mdi-map-marker"></i>{" "}
                              {user.city || "Location unknown"}
                            </li>
                            <li className="">
                              <i className="mdi mdi-wallet"></i>
                              {user.phoneNumber ? (
                                <p>{user.phoneNumber}</p>
                              ) : (
                                <p>Inget mobilnummer</p>
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className='col-lg-4'>
                              <div className='align-items-center'>
                              <li className="list-inline-item d-flex justify-content-start">
                          <div className="mt-2 mt-lg-0 d-flex flex-wrap align-items-start gap-1">
                            {user.skills?.map((skill, idx) => (
                              <span
                                key={idx}
                                className="badge bg-soft-secondary fs-14 mt-1"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          </li>
                              </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="align-items-center row">
                          <li className="list-inline-item d-flex justify-content-end">
                            <i className="mdi mdi-wallet"></i>
                            {user.cvUrl ? (
                              <a
                                className="cv-link"
                                href={user.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img className="avatar-md img-thumbnail" src="https://cdn-icons-png.freepik.com/512/36/36049.png" alt="Icon Image"></img>
                              </a>
                            ) : (
                              <p>Ingen CV-länk</p>
                            )}
                          </li>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No candidates found matching your search.</p>
            )}
          </div>
        </div>
      </div>

      {showMessageModal && (
        <div className="modal-message">
          <div className="modal-content-message">
            <span className="close-message" onClick={() => setShowMessageModal(false)}>
              &times;
            </span>
            <h2>Send Message to {selectedCandidate?.firstName} {selectedCandidate?.lastName}</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <button onClick={handleSendMessage} className="btn btn-primary">
              Skicka
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Candidate;