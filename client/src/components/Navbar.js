import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../pictures/logo.png";
import axios from "axios";

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [info, setInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fecthUserInfo();
  }, []);

  const fecthUserInfo = async () => {
    try {
      if (token) {
        const { data } = await axios("/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInfo(data);
      } else {
        console.log("No user logged in yet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setToken(localStorage.getItem("token"));
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="./pictures/gluten-icon-12.png">
          <img
            src={logo}
            alt=""
            width="100"
            height="90"
            className="d-inline-block align-center"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800"
            rel="stylesheet"
            type="text/css"
          ></link>
          Runaways
        </a>
        <div className="d-flex">
          {token && (
            <div className="d-flex">
              <div className="btn-group">
                <button className="btn btn-light">Hi, {info.username}!</button>
                <button
                  type="button"
                  class="btn btn-light dropdown-toggle dropdown-toggle-split me-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/profile">
                      Go to Profile
                    </a>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleLogOut()}
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
              <Link to="/dashboard">
                <button className={"btn btn-outline-secondary me-2 d-block"}>
                  Dashboard
                </button>
              </Link>
            </div>
          )}

          <Link to="/about">
            <button className={"btn btn-outline-secondary me-2 d-block"}>
              About
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
