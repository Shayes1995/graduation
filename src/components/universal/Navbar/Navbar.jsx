import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogoMainGreen from './logo_main_green.svg';
import contactBlack from './contact-black.svg';
import './Navbar.css';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const user = Cookies.get('user');
  const admin = Cookies.get('admin');
  const navigate = useNavigate();

  const updateUser = () => {
    try {
      const storedUser = Cookies.get('user');
      const storedAdmin = Cookies.get('admin');

      let userData = storedUser ? JSON.parse(storedUser) : null;
      let adminData = storedAdmin ? JSON.parse(storedAdmin) : null;

      if (adminData?.firstName) {
        setUserName(`${adminData.firstName} (Admin)`);
      } else if (userData?.firstName && userData?.lastName) {
        setUserName(`${userData.firstName.trim()} ${userData.lastName.trim()}`);
      } else if (userData?.name) {
        setUserName(userData.name);
      } else {
        setUserName('');
      }
    } catch (error) {
      console.error("Fel vid parsning av användardata:", error);
      setUserName('');
    }
  };

  useEffect(() => {
    updateUser();

    const interval = setInterval(() => {
      updateUser();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        Cookies.remove('user');
        Cookies.remove('admin');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        setUserName('');
        setDropdownVisible(false);
        navigate('/');
      })
      .catch(error => console.error("Fel vid utloggning:", error));
  };

  //Navigationsfunktioner
  const toMyPage = () => {
    navigate('/my-page');
    setDropdownVisible(false);
  };

  const adminAddJob = () => {
    navigate('/admin/add-posts');
    setDropdownVisible(false);
  };

  const adminSearch = () => {
    navigate('/candidate');
    setDropdownVisible(false);
  };

  const adminApplications = () => {
    navigate('/admin/applications');
    setDropdownVisible(false);
  };

  const toInbox = () => {
    navigate('/inbox');
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <header className="pt-3 mb-4 navBar">
      <div className="d-flex align-items-center mx-3 justify-content-center justify-content-md-between tesbar">
        <div className="col-md-3 mb-2 mb-md-0">
          <NavLink to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
            <img src={LogoMainGreen} alt="Main Logo" width="160" height="64" />
          </NavLink>
        </div>

        <ul className="nav col-12 fs-6 col-md-auto mb-3 justify-content-center mb-md-0">
          <li><NavLink to="/" className="nav-link px-2 link-dark" activeClassName="active">Lediga jobb</NavLink></li>
          <li><NavLink to="/ai" className="nav-link px-2 link-dark" activeClassName="active">Academy</NavLink></li>
          <li><NavLink to="/candidate" className="nav-link px-2 link-dark" activeClassName="active">För jobbsökande</NavLink></li>
          <li><NavLink to="/companies" className="nav-link px-2 link-dark" activeClassName="active">För företag</NavLink></li>
          <li><NavLink to="/about" className="nav-link px-2 link-dark" activeClassName="active">Om oss</NavLink></li>
          {/* {user && <li><NavLink to="/my-page" className="nav-link px-2 link-dark" activeClassName="active">Min sida</NavLink></li>} */}
          <li><NavLink to="/contact" className="nav-link px-2 link-dark" activeClassName="active">Kontakt</NavLink></li>
        </ul>

        <div className="col-md-3 text-end">
          {userName ? (
            <div className="dropdown m-0 p-0 col-md-3 text-end">
              <span onClick={toggleDropdown} className="dropdown-toggle" role="button">
                {userName}
              </span>
              {dropdownVisible && (
                <div className="dropdown-menu dropdown-menu-right show">
                  {user && <button onClick={toMyPage} className="dropdown-item">Mina sidor</button>}
                  {user && <NavLink to="/inbox" className="dropdown-item">Konversationer</NavLink>}
                  {admin && <button onClick={adminAddJob} className="dropdown-item">Skapa jobbannons</button>}
                  {admin && <button onClick={adminSearch} className="dropdown-item">Sök användare</button>}
                  {admin && <button onClick={adminApplications} className="dropdown-item">Rekrytering</button>} 
                  {admin && <button onClick={toInbox} className="dropdown-item">Meddelanden</button>}
                  <button onClick={handleLogout} className="dropdown-item">Logga ut</button>
                </div>
              )}
            </div>
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

