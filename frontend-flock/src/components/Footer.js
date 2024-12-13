// Chloe Gavrilovic 260955835
import React from 'react'
import '../styles/Footer.css'

export default function Footer() {
    return (
        <footer className='footer'>
            <div className='footer-links'>
                <a href='https://www.mcgill.ca/'>McGill University</a>
                <br></br>
                <a href='https://www.cs.mcgill.ca/'>McGill School of Computer Science</a>
            </div>
            <div className='footer-text'>
                <p>&copy; 2024 Flock</p>
                <p>by McGill SOCS</p>
            </div>
        </footer>
    )
}
