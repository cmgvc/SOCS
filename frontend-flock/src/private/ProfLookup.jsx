// Jacob Weldon 260986471
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfLookup.css";

const LookUp = () => {
    const [professorName, setProfessorName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setProfessorName(e.target.value);
    };

    const handleButtonClick = () => {
        if (professorName.trim() === '') {
            setError('Please enter a professor\'s name.');
            return;
        } else {
            setError(''); // Clear any existing errors
            console.log(`Looking up professor: ${professorName}`);

            navigate('/meetingRequest', { state: { professorName } });
        }
    };
    return (
    <div>
        <div>
            <h1 className="lookup-title-prof">Request a Meeting</h1>
            <p className="lookup-task-prof">Enter professor or TA's name:</p>
            <div>
                <input className="input-prof" type="professor" placeholder="Professor" value={professorName} onChange={handleInputChange} required />
                <button className="lookup-button" onClick={handleButtonClick}>Search</button>
            </div>
        </div>
    </div>
  );
};

export default LookUp;