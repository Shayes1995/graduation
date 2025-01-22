import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase/configfb";
import { supabase } from "../../supabase/Supabase";
import emailjs from "@emailjs/browser";
import "./Candidate.css";
 
const Candidate = () => {
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [cvData, setCvData] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
 
  // Debounce function for search input
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };
 
  // Fetch all users from Firestore
  const fetchUsersEffect = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setResults(users);
  };
 
  // Fetch CV data (PDF URL, CV text) for a given user
  const fetchCvData = async (userId) => {
    const { data, error } = await supabase
      .from("user_pdfs")
      .select("pdf_url, cv_text")
      .eq("user_id", userId)
      .single();
    if (!error && data) {
      setCvData((prev) => ({
        ...prev,
        [userId]: { pdfUrl: data.pdf_url, cvText: data.cv_text },
      }));
    }
  };
 
  useEffect(() => {
    // Fetch CV data for each user when results change
    results.forEach((user) => fetchCvData(user.id));
  }, [results]);
 
  // Search function with keyword matching
  const handleSearch = async () => {
    if (keywords.length === 0) {
      fetchUsersEffect();
      return;
    }
 
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
 
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
 
  // Debounced version of the search function
  const debouncedSearch = debounce(handleSearch, 300);
 
  useEffect(() => {
    debouncedSearch();
  }, [keywords]);
 
  useEffect(() => {
    fetchUsersEffect();
  }, []);
 
  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (keyword.trim() && !keywords.includes(keyword.trim().toLowerCase())) {
      setKeywords([...keywords, keyword.trim().toLowerCase()]);
      setKeyword(""); // Reset the search input after adding
    }
  };
 
  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };
 
  return (
    <section className="section homePage">
      <div className="candidatePage">
        <div className="candidate-list-widgets">
          <form className="form-candidate" onSubmit={handleAddKeyword}>
            <div className="d-arow">
              <div className="filler-job-form">
                <i className="uil uil-briefcase-alt"></i>
                <input
                  placeholder="Enter keywords (e.g., name, city, skill)"
                  type="search"
                  className="input-search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKeyword(e);
                    }
                  }}
                />
              </div>
              <div className="div-btn">
                <div className="searchDiv">
                  <button type="submit" className="button-candidate">
                    <i className="uil uil-filter"></i> Lägg till sökord
                  </button>
                  {/* <button onClick={handleSearch} className="button-candidate">
                    Sök
                  </button> */}
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
            <p className="results-p">{results.length} träffar</p>
            {results.length > 0 ? (
              results.map((user) => (
                <div key={user.id} className="candidate-list-box bookmark-post card">
                  <div className="card-body">
                    <div className="align-items-center row">
                      <div className="col-lg-2 ml-0 px-0">
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
                            setSelectedCandidate(user);
                            setShowMessageModal(true);
                          }}
                        >
                          Skicka meddelande
                        </button>
                      </div>
                      <div className="col-lg-2 pr-10 px-0 justify-content-start">
                        <h5 className="fs-19 mb-0">
                          <a className="primary-link" href="#">
                            {user.firstName} {user.lastName}
                          </a>
                          {/* <span className="badge bg-warning ms-1">
                              <i className="mdi mdi-star align-middle"></i>
                              {user.rating || "N/A"}
                            </span> */}
                        </h5>
                        <ul className="list-inline mb-0 text-muted mt-3">
                          <li className="list-inline-item">
                            <i className="mdi mdi-map-marker"></i> {user.city || "Location unknown"}
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
                      <div className="col-lg-4">
                        <div className="align-items-center">
                          <li className="list-inline-item d-flex justify-content-start">
                            <div className="mt-2 mt-lg-0 d-flex flex-wrap align-items-start gap-1">
                              {user.skills?.map((skill, idx) => (
                                <span key={idx} className="badge bg-soft-secondary fs-14 mt-1">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </li>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        {cvData[user.id]?.pdfUrl && (
                          <div className="button-box">
                            <button
                              onClick={async () => {
                                try {
                                  const filePath = cvData[user.id].pdfUrl.replace(
                                    "https://eebbwtkghyyqjlphiuer.supabase.co/storage/v1/object/public/pdfs/",
                                    ""
                                  );
                                  const { data, error } = await supabase.storage
                                    .from("pdfs")
                                    .download(filePath);
                                  if (error) {
                                    console.error("❌ Kunde inte ladda ner PDF:", error);
                                    return;
                                  }
                                  const url = URL.createObjectURL(data);
                                  const a = document.createElement("a");
                                  a.href = url;
                                  a.download = filePath;
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
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowMessageModal(false)}>&times;</span>
            <h4>Send Message to {selectedCandidate?.firstName}</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="4"
            />
            <button
              onClick={() => {
                // Add email sending logic here
                emailjs.send("your_service_id", "your_template_id", {
                  to_name: selectedCandidate?.firstName,
                  message,
                })
                .then((response) => {
                  console.log("Message sent successfully", response);
                })
                .catch((error) => {
                  console.error("Error sending message", error);
                });
                setShowMessageModal(false);
              }}
              className="btn btn-primary mt-2"
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
 
export default Candidate;