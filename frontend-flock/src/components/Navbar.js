import React from 'react'
import '../styles/Navbar.css'
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
  return (
    <nav className="navbar">
        <div className="navbar-banner">
            <img src="/path-to-logo-icon.png"
                alt="Logo"
                className="navbar-icon"/>
            <div className="navbar-text">
                <h1>Flock</h1>
                <p>by McGill SOCS</p>
            </div>
        </div>
        <div className="navbar-links">
            <button className="navbar-hamburger">&#9776;</button>
            <button className="navbar-profile"><PersonIcon /><p>Profile</p></button>
        </div>
    </nav>
  )
}

export default Navbar
