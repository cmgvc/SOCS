import React, {useEffect, useState} from 'react'
import '../styles/Navbar.css'
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username'));

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
                <button className="navbar-profile"><PersonIcon />
                    {username ? <p>{username}</p> : <p>Login</p>}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
