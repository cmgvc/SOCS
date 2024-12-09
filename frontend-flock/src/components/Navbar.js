import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import PersonIcon from "@mui/icons-material/Person";
import Hamburger from "hamburger-react";
import FlockFavicon from "../svg/flock-favicon.svg";
import { ReactComponent as SettingsSvg } from "../svg/settings.svg";

function Navbar() {
  const [firstName, setName] = useState(
    localStorage.getItem("firstName") || "login"
  );
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("firstName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

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
            style={{ width: "8rem", height: "8rem" }}
          />
          <div className="navbar-text">
            <h1>Flock</h1>
            <p>by McGill SOCS</p>
          </div>
        </div>
        <div className="navbar-links">
          <Hamburger toggled={isOpen} toggle={setOpen} />
          {firstName !== "login" && (
            <>
              <a href="/settings">
                {<SettingsSvg className="settings-icon" />}
              </a>
            </>
          )}
          <a href="/auth">
            <button className="navbar-profile">
              <PersonIcon />
              <p>{firstName}</p>
            </button>
          </a>
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
            {firstName !== "login" && (
              <>
                <li>
                  <a href="/create">Create Meeting</a>
                </li>
                <li>
                  <a href="/request">Request Meeting</a>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
