import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/configfb';
import  './Candidate.css'

const Candidate = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    const q = query(collection(db, 'users'), where('skills', 'array-contains', keyword));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());
    setResults(users);
  };

  return (
    <section className="section homePage">
      <div className="candidatePage py-4">
        <div className="justify-content-center row">
          <div className="col-lg-12">
            <div className="candidate-list-widgets mb-4">
              <form onSubmit={handleSearch}>
                <div className="g-2 row">
                  <div className="col-lg-6 col-md-4">
                    <div className="filler-job-form">
                      <i className="uil uil-briefcase-alt"></i>
                      <input
                        id="exampleFormControlInput1"
                        placeholder="Job, Company name..."
                        type="search"
                        className="form-control filler-job-input-box form-control"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="filler-job-form">
                      <i className="uil uil-clipboard-notes"></i>
                      <select
                        className="searchSelect form-select selectForm__inner"
                        data-trigger="true"
                        name="choices-single-categories"
                        id="choices-single-categories"
                        aria-label="Default select example"
                      >
                        <option value="4">Accounting</option>
                        <option value="1">IT &amp; Software</option>
                        <option value="3">Marketing</option>
                        <option value="5">Banking</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3 m-0 p-0 text-end">
                    <div className="searchDiv">
                      <button type="submit" className="btn btn-primary">
                        <i className="uil uil-filter"></i> Search
                      </button>
                    </div>
                  </div>
                </div>
              </form>
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
                                src={user.avatarUrl || "https://bootdey.com/img/Content/avatar/avatar2.png"}
                                alt=""
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
                                <i className="mdi mdi-map-marker"></i> {user.location || "Location unknown"}
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
