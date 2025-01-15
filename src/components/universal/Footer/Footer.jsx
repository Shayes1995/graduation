import React from 'react'
import FooterImg from './Footer.png'
import './Footer.css'
import { FaLinkedin } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Logo from './logo_small_footer.svg';

const Footer = () => {
  return (
    <footer>
      <div className="container-footer">
        <div className="footer-row">
          <div className="footer-box">
            <p>Lediga jobb</p>
            <ul>
              <li>
                <a href="">Jobb inom IT</a>
              </li>
              <li>
                <a href="">Jobb inom teknik</a>
              </li>
              <li>
                <a href="">Jobb inom ekonomi</a>
              </li>
              <li>
                <a href="">Jobb inom lager & logistik</a>
              </li>
            </ul>
          </div>
          <div className="footer-box">
            <p>För jobbsökande</p>
            <ul>
              <li>
                <a href="">Söka jobb</a>
              </li>
              <li>
                <a href="">Skapa jobbsökande</a>
              </li>
              <li>
                <a href="">Karriär & jobbevakning</a>
              </li>
              <li>
                <a href="">International applicants</a>
              </li>
            </ul>
          </div>
          <div className="footer-box">
            <p>För företag</p>
            <ul>
              <li>
                <a href="">Vårt erbjudande</a>
              </li>
              <li>
                <a href="">Rekryteringsföretag</a>
              </li>
              <li>
                <a href="">Bemanningsföretag</a>
              </li>
              <li>
                <a href="">White papers</a>
              </li>
            </ul>
          </div>
          <div className="footer-box">
            <p>Kontakt</p>
            <ul>
              <li>
                <a href="">Hitta till våra kontor</a>
              </li>
              <li>
                <a href="">Kontakta oss</a>
              </li>
              <li>
                <a href="">Fakturaadresser</a>
              </li>
              <li>
                <a href="">Nyhetsrum</a>
              </li>
              <li>
                <a href="">Vanliga frågor</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-row second-row">
          <div className="row-2nd logo-row">
            <div className="logo-box">
              <FaLinkedin className='footer-icon' />
            </div>
            <div className="logo-box">
              <FaYoutube className='footer-icon' />
            </div>
            <div className="logo-box">
              <FaInstagram className='footer-icon' />
            </div>
            <div className="logo-box">
              <FaFacebook className='footer-icon' />
            </div>

          </div>
          <div className="row-2nd">
            <p className='bold-p'>
              Internationellt hittar du även Academic Work i Norge, Finland, Danmark, Tyskland och Schweiz.
            </p>
          </div>
          <div className="row-2nd">
            <p>Copyright © 2025 - Academic Work | info@academicwork.se | 08-562 448 00</p>
          </div>
          <div className="row-2nd">
            <button className='cookies-btn'>
              Cookies Settings
            </button>
          </div>
        </div>
        <div className="footer-row">
          <div className="full-logo-row">
            <div className="img-container">
              <img src={Logo} alt="footer" />
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer