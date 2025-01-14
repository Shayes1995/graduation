import LogoMainGreen from './logo_main_green.svg';
import contactBlack from './contact-black.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="py-3 mb-4">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between">
          <div className="col-md-3 mb-2 mb-md-0">
            <Link to="/" className="d-inline-flex link-body-emphasis text-decoration-none">
              <img src={LogoMainGreen} alt="Main Logo" width="160" height="64" />
            </Link>
          </div>

          <ul className="nav col-12 col-md-auto mb-3 justify-content-center mb-md-0">
            <li><Link to="#" className="nav-link px-3 link-secondary">Lediga jobb</Link></li>
            <li><Link to="#" className="nav-link px-3">Academy</Link></li>
            <li><Link to="#" className="nav-link px-3">För jobbsökande</Link></li>
            <li><Link to="#" className="nav-link px-3">För företag</Link></li>
            <li><Link to="#" className="nav-link px-3">Om oss</Link></li>
            <li><Link to="#" className="nav-link px-3">Kontakt</Link></li>
            <li><Link to="/min-sida" className="nav-link px-3">Min sida</Link></li>
          </ul>

          <div className="col-md-3 text-end">
            <Link to="/login" className="d-inline-flex link-body-emphasis text-decoration-none">
              <img src={contactBlack} alt="Contact Black" width="40" height="32" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;