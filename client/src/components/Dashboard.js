import "./Dashboard.css";
import React, { useState } from "react";
import background from "../pictures/background.png";
import map from "../pictures/map.jpg";
import Navbar from "./Navbar";

function Dashboard() {
  const [search, setSearch] = useState(true);
  const handleSearch = (search) => {
    setSearch(search);
  };

  const [about, setAbout] = useState([]);
  const handleAbout = (about) => {
    setAbout(about);
  };

  return (
    <div className="Dashboard">
      <Navbar />
      <div className="map" style={{ mapImage: `url(${map})` }}>
        <div
          className="background-image border d-flex justify-content-center align-items-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          <form className="rounded p-4 p-sm-3 bg-white">
            <div className="form-group mb-3" controlId="formSearch">
              <label className="form-label" for="formGroupSearch">
                Search Hosting
              </label>
              <input
                className="form-control form-control-sm"
                type="search"
                placeholder="Enter a city"
              />
              <small id="Search" className="text-muted">
                Enter a city, country or Zip code.
              </small>
            </div>
            <div className="form-group mb-3" controlId="formBasicDates">
              <label className="form-label">When?</label>
              <input
                className="form-control form-control-sm"
                type="dates"
                placeholder="Enter estimated dates to check in/out."
              />
            </div>
            <div className="d-flex">
              <button type="button" class="btn btn-outline-success">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
