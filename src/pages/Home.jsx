import React from "react";
import "../styles.css"; // Make sure the path is correct
import Adslist from "../components/adslist/Adslist";

const Home = () => {
  return (
    <div className="homePage">
      <Adslist />
    </div>
  );
}

export default Home;
