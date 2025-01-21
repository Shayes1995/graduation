import React from "react";
import './Contact.css';
import contactPicture from "./images/contact-picture.jpg";


const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Kontakta oss</h1>
      <div className="text-container">
        <p>Är du jobbsökande och har en fråga om ett jobb eller en specifik ansökningsprocess? Eller är du arbetsgivare och vill veta mer om hur vi kan hjälpa till med rekrytering och bemanning? Här nedan hittar du våra kontaktuppgifter. Hör av dig med din fråga till oss, så gör vi vårt bästa för att hjälpa dig!</p>
      </div>
      <div className="contact-row">
        {/* Kontaktinformation */}
        <div className="col-md-6 mb-4">
          <h3>Vår information</h3>
          <p>
            <strong>Adress:</strong> Exempelgatan 123, 123 45 Stockholm
          </p>
          <p>
            <strong>Telefon:</strong> +46 123 456 789
          </p>
          <p>
            <strong>E-post:</strong>{" "}
            <a href="mailto:awtalent@gmail.com">awtalent@gmail.com</a>
          </p>

          <img src={contactPicture} alt="Kontakta oss" className="info-image" />
        </div>

        {/* Kontaktformulär */}
        <div className="col-md-6">
          <h3>Skicka ett meddelande</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Formuläret skickades!");
            }}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Namn
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Ditt namn"
                aria-label="Skriv ditt namn"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-post
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Din e-postadress"
                aria-label="Ange din e-postadress"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Meddelande
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                placeholder="Skriv ditt meddelande här"
                aria-label="Skriv ditt meddelande"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Skicka
            </button>
          </form>
          </div>
        </div>
      </div>
  );
};

export default Contact;
