import React from "react";
import './About.css';
import goalPicture from "./images/our-goal.jpg";
import historyPicture from "./images/our-history.jpg";
import firstProfilePicture from "./images/profile-man.png";
import secondProfilePicture from "./images/profile-woman.png";


const About = () => {
  return (
    <div className="about-container">
      <h1 className="text-center mb-4">Om oss</h1>
      <div className="text-container">
        <p>Välkommen till oss på AWTalent! Vi är en passionerad och driven grupp som strävar efter att revolutionera rekryteringsprocessen. Genom att kombinera innovation, användarvänlighet och modern teknik skapar vi plattformar som förenklar och effektiviserar matchningen mellan arbetsgivare och kandidater. Vår mission är att erbjuda både företag och jobbsökande en smidig, snabb och effektiv upplevelse. Vi är stolta över att vara en del av Academic Work och ser fram emot att fortsätta växa och förbättra rekryteringsvärlden.</p>
      </div>
      <div className="row">

        <div className="col-md-6 mb-4">
          <h3>Vår historia</h3>
          <p>
          Academic Work har under många år varit en pålitlig aktör på arbetsmarknaden och har erbjudit en etablerad jobbank där kandidater kan söka jobb och ansöka till specifika tjänster. Men för att möta det växande behovet hos våra företagskunder och personal har vi lanserat en ny plattform: AWTalent. 
          </p>
          <p>
          AWTalent är ett resultat av vår vilja att skapa en smidigare och mer effektiv rekryteringsprocess, där vi kan förbättra matchningen mellan kandidater och arbetsgivare. Genom att skapa en plattform som fokuserar på enkelhet och användarvänlighet, strävar vi efter att ge våra kunder ett bättre verktyg för att snabbt hitta de bästa kandidaterna för deras behov.


          </p>
          <img src={goalPicture} alt="Om oss" className="about-image" />
        </div>

       
        <div className="col-md-6">
        <img src={historyPicture} alt="Om oss" className="about-image" />
          <h3>Vårt mål</h3>
          <p>
          Målet med AWTalent är att bygga en modern, användarvänlig och säker webbapplikation som förenklar och automatiserar delar av rekryteringsprocessen för både kandidater och administratörer. Plattformen kommer att erbjuda ett enkelt sätt för kandidater att söka jobb och ge administratörer möjlighet att effektivt hantera jobbannonser och ansökningar.
          </p>
          <p>
          Vår vision är att skapa en intuitiv plattform där både kandidat och administratör snabbt och enkelt kan genomföra de åtgärder de behöver för att säkerställa en smidig rekryteringsprocess. För att uppnå detta implementerar vi en robust databasstruktur och säkerställer att applikationen är responsiv och mobilvänlig, så att användare kan få tillgång till den från alla enheter.
          </p>
      
      </div>

     
      <div className="mt-5">
        <h3 className="text-center mb-4">Möt vårt team</h3>
        <div className="about-row">
          <div className="col-md-4 text-center mb-4">
            <img
              src={secondProfilePicture}
              alt="Team Member 1"
              className="rounded-circle mb-2"
              width="150"
              height="150"
            />
            <h5>Evelina Enqvist</h5>
            <p>Grundare</p>
          </div>
          <div className="col-md-4 text-center mb-4">
            <img
              src={firstProfilePicture}
              alt="Team Member 2"
              className="rounded-circle mb-2"
              width="150"
              height="150"
            /> 
            <h5>Kevin Badwi</h5>
            <p>Grundare</p>
          </div>
          <div className="col-md-4 text-center mb-4">
            <img
              src={firstProfilePicture}
              alt="Team Member 3"
              className="rounded-circle mb-2"
              width="150"
              height="150"
            />
            <h5>Patrik Skantz</h5>
            <p>Grundare</p>
          </div>
          <div className="col-md-4 text-center mb-4">
            <img
              src={firstProfilePicture}
              alt="Team Member 4"
              className="rounded-circle mb-2"
              width="150"
              height="150"
            />
            <h5>Shayan Sadr</h5>
            <p>Grundare</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;
