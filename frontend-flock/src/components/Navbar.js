// Chloe Gavrilovic 260955835
import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import PersonIcon from "@mui/icons-material/Person";
import Hamburger from "hamburger-react";
import FlockFavicon from "../svg/flock-favicon.svg";
import { ReactComponent as SettingsSvg } from "../svg/settings.svg";

function Navbar() {
  const token = localStorage.getItem("token");
  const [firstName, setName] = useState(
    localStorage.getItem("firstName") || "Login"
  );
  const [isOpen, setOpen] = useState(false);
  const isFaculty = localStorage.getItem("isFaculty");

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
            // style={{ width: "8rem", height: "8rem" }}
          />
          <div className="banner-bar"></div>
          <div className="navbar-text">
            <h1>Flock</h1>
            <p>by McGill SOCS</p>
          </div>
        </div>
        <div className="navbar-links">
          <Hamburger toggled={isOpen} toggle={setOpen} />
          {token && (
            <>
              <a href="/settings">
                {<SettingsSvg className="settings-icon" />}
              </a>
            </>
          )}
          <a href={!token ? "/auth" : "/dashboard"}>
            <button className="navbar-profile">
              <PersonIcon />
              {token ? <p>{firstName}</p> : <p>Login</p>}
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
            {token && (
              <>
                {isFaculty && (
                  <>
                    <li>
                      <a href="/create">Create Booking</a>
                    </li>
                    <li>
                      <a href="/block">Block Off Times</a>
                    </li>
                  </>
                )}
                <li>
                  <a href="/profLookup">Request Meeting</a>
                </li>
                <li>
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
