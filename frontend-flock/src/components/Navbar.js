import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import PersonIcon from "@mui/icons-material/Person";
import Hamburger from "hamburger-react";
import FlockFavicon from "../svg/flock-favicon.svg";

function Navbar() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", (e) => {
        if (e.target.classList.contains("overlay")) {
          setOpen(false);
        }
      });
    }
  }, [isOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-banner">
          <img
            src={FlockFavicon}
            alt="Logo"
            className="navbar-icon"
            style={{ width: "7rem", height: "7rem", marginTop: "1rem" }}
          />
          <div className="navbar-text">
            <h1>Flock</h1>
            <p>by McGill SOCS</p>
          </div>
        </div>
        <div className="navbar-links">
          <Hamburger toggled={isOpen} toggle={setOpen} />
          {username ? (
            <a href="/dashboard">
              <button className="navbar-profile">
                <PersonIcon />
                <p>{username}</p>
              </button>
            </a>
          ) : (
            <a href="/auth">
              <button className="navbar-profile">
                <PersonIcon />
                <p>Login</p>
              </button>
            </a>
          )}
        </div>
      </nav>
      {isOpen && <div className="overlay"></div>}
      {isOpen && (
        <div id="dropdownMenu" className="dropdown-menu">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/book">Book Meeting</a>
            </li>
            {username ? (
              <>
                <li>
                  <a href="/create">Create Meeting</a>
                </li>
                <li>
                  <a href="/request">Request Meeting</a>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
