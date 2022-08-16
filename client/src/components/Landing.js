import "./Landing.css";
import React, { useState } from "react";
import background from "../pictures/background.png";
import map from "../pictures/map.jpg";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Landing() {
  const [credentials, setCredentials] = useState({
    username: "",
    pass: "",
  });
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  //check if credentials are correct and redirect to /dashboard
  //"username": "Helen9",
  //"password": "909090",
  //"email": "helen9@testmail.com"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFailed(false);
    try {
      const { data } = await axios("/auth", {
        method: "POST",
        data: credentials,
      });
      //we store the token locally
      localStorage.setItem("token", data.token);
      console.log(localStorage.getItem("token"));
      alert("You've logged in correctly!");
      navigate("/dashboard");
    } catch (error) {
      setFailed(true);
      console.log(error);
    }
  };

  return (
    <div className="Landing">
      <Navbar />
      <div className="map" style={{ mapImage: `url(${map})` }}>
        <div
          className="background-image border d-flex justify-content-center align-items-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          <form className="rounded p-4 p-sm-3 bg-white">
            <div className="form-group mb-3" controlId="formBasicEmail">
              <label className="form-label" for="formGroupEmailInput">
                Username
              </label>
              <input
                className="form-control form-control-sm"
                type="text"
                placeholder="Example23"
                name="username"
                value={credentials.username}
                onChange={(e) => handleInput(e)}
              />
              <small id="emailShare" className="text-muted">
                We'll never share your info with anyone else.
              </small>
            </div>
            <div className="form-group mb-3" controlId="formBasicPassword">
              <label className="form-label">Password</label>
              <input
                className="form-control form-control-sm"
                type="password"
                placeholder="Enter password"
                name="pass"
                value={credentials.pass}
                onChange={(e) => handleInput(e)}
              />
            </div>

            <div className="form-group mb-3" controlId="formBasicCheckbox">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label ms-2">Remember Me</label>
            </div>
            <div className="d-flex">
              <button
                type="submit"
                className={"btn btn-outline-success"}
                onClick={(e) => handleSubmit(e)}
              >
                Login
              </button>
              <Link to="/signup">
                <button
                  type="button"
                  className={"ms-3 btn btn-outline-success"}
                >
                  Sign Up
                </button>
              </Link>
            </div>
            {failed && (
              <div className="alert alert-danger mt-2" role={"alert"}>
                Your log in attempt failed!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Landing;
