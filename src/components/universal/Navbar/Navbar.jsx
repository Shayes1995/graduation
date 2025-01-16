import React, { useState, useEffect } from 'react';
import LogoMainGreen from './logo_main_green.svg';
import { getAuth, signOut } from 'firebase/auth';
import contactBlack from './contact-black.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const user = Cookies.get('user');
  const admin = Cookies.get('admin');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const userData = JSON.parse(user);
      setUserName(`${userData.firstName} ${userData.lastName}`);
    } else if (admin) {
      const adminData = JSON.parse(admin);
      if (adminData.firstName && adminData.lastName) {
        setUserName(`${adminData.firstName} ${adminData.lastName} (Admin)`);
      } else {
        setUserName('Admin');
      }
    }
  }, [user, admin]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth) 
        .then(() => {
            Cookies.remove('user');
            Cookies.remove('admin');
            localStorage.removeItem('user');
            localStorage.removeItem('admin');

            setUserName(''); // nollställa användarnamnet
            setDropdownVisible(false); // stänging fö dropdown-menyn
            navigate('/');
        })
        .catch((error) => {
            console.error("Fel vid utloggning:", error);
        });
};


  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="pt-3 mb-4 navBar">
      <div className="d-flex align-items-center mx-3 justify-content-center justify-content-md-between">
        <div className="col-md-3 mb-2 mb-md-0">
          <NavLink to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
            <img src={LogoMainGreen} alt="Main Logo" width="160" height="64" />
          </NavLink>
        </div>

        <ul className="nav col-12 fs-6 col-md-auto mb-3 justify-content-center mb-md-0">
          <li><NavLink to="/jobs" className="nav-link px-2 link-dark" activeClassName="active">Lediga jobb</NavLink></li>
          <li><NavLink to="/academy" className="nav-link px-2 link-dark" activeClassName="active">Academy</NavLink></li>
          <li><NavLink to="/candidates" className="nav-link px-2 link-dark" activeClassName="active">För jobbsökande</NavLink></li>
          <li><NavLink to="/companies" className="nav-link px-2 link-dark" activeClassName="active">För företag</NavLink></li>
          <li><NavLink to="/about" className="nav-link px-2 link-dark" activeClassName="active">Om oss</NavLink></li>
          {user && <li><NavLink to="/my-page" className="nav-link px-2 link-dark" activeClassName="active">Min sida</NavLink></li>}
          <li><NavLink to="/contact" className="nav-link px-2 link-dark" activeClassName="active">Kontakt</NavLink></li>
        </ul>

        <div className="col-md-3 text-end">
          {user || admin ? (
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          ) : (
            <NavLink to="/login" className="d-inline-flex link-body-emphasis text-decoration-none">
              <img src={contactBlack} alt="Contact Black" width="40" height="32" />
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
