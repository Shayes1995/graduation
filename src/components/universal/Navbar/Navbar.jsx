import React from 'react';
import LogoMainGreen from './logo_main_green.svg';
import contactBlack from './contact-black.svg';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const user = Cookies.get('user');
  const admin = Cookies.get('admin');
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('admin');
    navigate('/login');
  };

  return (
    <header className="pt-3 mb-4 navBar">
        <div className="d-flex align-items-center mx-3 justify-content-center justify-content-md-between">
          <div className="col-md-3 mb-2 mb-md-0">
            <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
              <img src={LogoMainGreen} alt="Main Logo" width="160" height="64" />
            </Link>
          </div>

          <ul className="nav col-12 fs-6 col-md-auto mb-3 justify-content-center mb-md-0">
            <li><Link to="#" className="nav-link px-2 link-dark text-hover">Lediga jobb</Link></li>
            <li><Link to="#" className="nav-link px-2 link-dark">Academy</Link></li>
            <li><Link to="#" className="nav-link px-2 link-dark">För jobbsökande</Link></li>
            <li><Link to="#" className="nav-link px-2 link-dark">För företag</Link></li>
            <li><Link to="#" className="nav-link px-2 link-dark">Om oss</Link></li>
<<<<<<< HEAD
            <li><Link to="#" className="nav-link px-2 link-dark">Kontakt</Link></li>
            {user && <li><Link to="/my-page" className="nav-link px-3">Min sida</Link></li>}
            {admin && <li><Link to="/admin/add-posts" className="nav-link px-3">Add job</Link></li>}
            {admin && <li><Link to="/admin/search" className="nav-link px-3">Search Users</Link></li>}
=======
            <li><Link to="/candidate" className="nav-link px-2 link-dark">Kontakt</Link></li>
            {user && <li><Link to="/min-sida" className="nav-link px-3">Min sida</Link></li>}
>>>>>>> 11dd4c9 (Candidate)
          </ul>

          <div className="col-md-3 text-end">
            {user || admin ? (
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            ) : (
              <Link to="/login" className="d-inline-flex link-body-emphasis text-decoration-none">
                <img src={contactBlack} alt="Contact Black" width="40" height="32" />
              </Link>
            )}
          </div>
        </div>
    </header>
  )
}

export default Navbar;