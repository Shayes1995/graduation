import React, { useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/configfb';
import './Candidate.css';

const Candidate = () => {
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [results, setResults] = useState([]);

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (keyword.trim() && !keywords.includes(keyword.trim().toLowerCase())) {
      setKeywords([...keywords, keyword.trim().toLowerCase()]);
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleSearch = async () => {
    if (keywords.length === 0) return;

    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());

    const filteredUsers = users.filter(user => {
      const userKeywords = [
        user.firstName?.toLowerCase() || '',
        user.lastName?.toLowerCase() || '',
        user.city?.toLowerCase() || '',
        ...(user.skills || []).map(skill => skill.toLowerCase())
      ];
      return keywords.every(k => 
        userKeywords.some(userKeyword => userKeyword.includes(k))
      );
    });

    setResults(filteredUsers);
  };

  return (
    <section className="section homePage">
      <div className="candidatePage py-4">
        <div className="justify-content-center row">
          <div className="col-lg-12">
            <div className="candidate-list-widgets mb-4">
              <form onSubmit={handleAddKeyword}>
                <div className="g-2 row">
                  <div className="col-lg-6 col-md-4">
                    <div className="filler-job-form">
                      <i className="uil uil-briefcase-alt"></i>
                      <input
                        id="exampleFormControlInput1"
                        placeholder="Enter keywords (e.g., name, city, skill)"
                        type="search"
                        className="form-control filler-job-input-box form-control"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 m-0 p-0 text-end">
                    <div className="searchDiv">
                      <button type="submit" className="btn btn-primary">
                        <i className="uil uil-filter"></i> Add Keyword
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
              <div className="searchDiv mt-3">
                <button onClick={handleSearch} className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="candidate-list">
              {results.length > 0 ? (
                results.map((user, index) => (
                  <div key={index} className="candidate-list-box bookmark-post card mt-4">
                    <div className="p-4 card-body">
                      <div className="align-items-center row">
                        <div className="col-auto">
                          <div className="candidate-list-images">
                            <a href="#">
                              <img
                                src={user.profilePicUrl || "https://bootdey.com/img/Content/avatar/avatar2.png"}
                                alt="User Avatar"
                                className="avatar-md img-thumbnail rounded-circle"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-5">
                          <div className="candidate-list-content mt-3 mt-lg-0">
                            <h5 className="fs-19 mb-0">
                              <a className="primary-link" href="#">
                                {user.firstName} {user.lastName}
                              </a>
                              <span className="badge bg-warning ms-1">
                                <i className="mdi mdi-star align-middle"></i>{user.rating || "N/A"}
                              </span>
                            </h5>
                            <p className="text-muted mb-2">{user.jobTitle || "No title"}</p>
                            <ul className="list-inline mb-0 text-muted">
                              <li className="list-inline-item">
                                <i className="mdi mdi-map-marker"></i> {user.city || "Location unknown"}
                              </li>
                              <li className="list-inline-item">
                                <i className="mdi mdi-wallet"></i> ${user.hourlyRate || "0"} / hour
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="mt-2 mt-lg-0 d-flex flex-wrap align-items-start gap-1">
                            {user.skills?.map((skill, idx) => (
                              <span key={idx} className="badge bg-soft-secondary fs-14 mt-1">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="favorite-icon">
                        <a href="#">
                          <i className="mdi mdi-heart fs-18"></i>
                        </a>
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
        <div className="row">
          <div className="mt-4 pt-2 col-lg-12">
            <nav aria-label="Page navigation example">
              <div className="pagination job-pagination mb-0 justify-content-center">
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    4
                  </a>
                </li>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Candidate;