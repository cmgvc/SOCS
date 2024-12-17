// Chloe Gavrilovic 260955835
import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import PersonIcon from "@mui/icons-material/Person";
import Hamburger from "hamburger-react";
import FlockFavicon from "../svg/flock-favicon.svg";

function Navbar() {
  const token = localStorage.getItem("token");
  const [firstName, setName] = useState(localStorage.getItem("firstName") || "Login");
  const [isOpen, setOpen] = useState(false);
  const isFaculty = localStorage.getItem("isFaculty");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("isFaculty");
    window.open("/", "_self");
  };

  useEffect(() => {
    const storedName = localStorage.getItem("firstName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (e.target.classList.contains("overlay")) {
          setOpen(false);
        }
      };
      window.addEventListener("click", handleClickOutside);

      return () => {
        window.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-links">
          <div className="navbar-links-left">
            <div className="navbar-banner">
              <a href="/">
                <img src={FlockFavicon} alt="Logo" className="navbar-icon" />
              </a>
              <div className="banner-bar"></div>
              <a href="/">
                <div className="navbar-text">
                  <h1>Flock</h1>
                  <p>by McGill SOCS</p>
                </div>
              </a>
            </div>
            <div className="navbar-left-pages">
              <a href="/book">Book Meeting</a>
              <a href={token ? "/dashboard" : "/auth"}>Dashboard</a>
              {token && isFaculty === "true" && (
                <>
                  <a href="/create">Create meeting</a>
                  <a href="/block">Block availability</a>
                </>
              )}
            </div>
          </div>
          <div className="navbar-links-right">
            <div className="hamburger-menu">
              <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>
            {!token ? (
              <a href="/auth">
                <b>Log in</b>
              </a>
            ) : (
              <a className="logout-btn" onClick={handleLogout}>
                <p>Log out</p>
              </a>
            )}
            <a href={!token ? "/signup" : "/dashboard"}>
              <button className="navbar-profile">
                <PersonIcon />
                {token ? <p>{firstName}</p> : <p><b>Sign up</b></p>}
              </button>
            </a>
          </div>
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
              <a href="/book">Book Meeting</a>
            </li>
            <li>
              <a href={token ? "/dashboard" : "/auth"}>Dashboard</a>
            </li>
            {token && isFaculty === "true" && (
              <>
                <li>
                  <a href="/create">Create meeting</a>
                </li>
                <li>
                  <a href="/block">Block availability</a>
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
