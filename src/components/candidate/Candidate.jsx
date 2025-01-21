import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/configfb";
import emailjs from "@emailjs/browser";

import "./Candidate.css";

const Candidate = () => {
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchUsersEffect = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setResults(users);
  };

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

  const debouncedSearch = debounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [keywords]); // Kör sökning när keywords uppdateras

  useEffect(() => {
    fetchUsersEffect(); // Hämta alla kandidater när komponenten laddas
  }, []);

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

  return (
    <section className="section homePage">
      <div className="candidatePage">
        <div className="candidate-list-widgets">
          <form className="form-candidate" onSubmit={handleAddKeyword}>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKeyword(e);
                    }
                  }}
                />
              </div>
              <div className="div-btn">
                <button type="submit" className="button-candidate">
                  <i className="uil uil-filter"></i> Lägg till sökord
                </button>
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
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="align-items-center">
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
    </section>
  );
};

export default Candidate;
