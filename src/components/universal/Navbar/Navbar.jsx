import LogoMainGreen from './logo_main_green.svg';
import contactBlack from './contact-black.svg';

const Navbar = () => {
  return (
    <header className="py-3 mb-4 border-bottom">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between">
          <div className="col-md-3 mb-2 mb-md-0">
            <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
              <img src={LogoMainGreen} alt="Main Logo" width="160" height="64" />
            </a>
          </div>

          <ul className="nav col-12 col-md-auto mb-3 justify-content-center mb-md-0">
            <li><a href="#" className="nav-link px-3 link-secondary">Lediga jobb</a></li>
            <li><a href="#" className="nav-link px-3">Academy</a></li>
            <li><a href="#" className="nav-link px-3">För jobbsökande</a></li>
            <li><a href="#" className="nav-link px-3">För företag</a></li>
            <li><a href="#" className="nav-link px-3">Om oss</a></li>
            <li><a href="#" className="nav-link px-3">Kontakt</a></li>
          </ul>

          <div className="col-md-3 text-end">
            <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
              <img src={contactBlack} alt="Contact Black" width="40" height="32" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;
