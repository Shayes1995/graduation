import React, { useState, useEffect } from 'react';
import LogoMainGreen from './logo_main_green.svg';
import contactBlack from './contact-black.svg';
import { Link, useNavigate } from 'react-router-dom';
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
    Cookies.remove('user');
    Cookies.remove('admin');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
          <li><Link to="/" className="nav-link px-2 link-dark text-hover">Lediga jobb</Link></li>
          <li><Link to="#" className="nav-link px-2 link-dark">Academy</Link></li>
          <li><Link to="#" className="nav-link px-2 link-dark">För jobbsökande</Link></li>
          <li><Link to="#" className="nav-link px-2 link-dark">För företag</Link></li>
          <li><Link to="/my-page" className="nav-link px-2 link-dark">Om oss</Link></li>
          <li><Link to="/candidate" className="nav-link px-2 link-dark">Kontakt</Link></li>
        </ul>

        <div className="col-md-3 text-end">
          {userName ? (
            <div className="dropdown m-0 p-0 col-md-3 text-end">
              <span onClick={toggleDropdown} className="dropdown-toggle" role="button">
                {userName}
              </span>
              {dropdownVisible && (
                <div className="dropdown-menu dropdown-menu-right show">
                  {user && <button onClick={() => navigate('/my-page')} className="dropdown-item">MyPage</button>}
                  {admin && <button onClick={() => navigate('/admin/add-posts')} className="dropdown-item">Add job</button>}
                  {admin && <button onClick={() => navigate('/admin/search')} className="dropdown-item">Search Users</button>}
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="d-inline-flex link-body-emphasis text-decoration-none">
              <img src={contactBlack} alt="Contact Black" width="40" height="32" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;