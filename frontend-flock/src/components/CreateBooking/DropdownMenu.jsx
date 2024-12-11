// coded by Danielle Wahrhaftig

import React, { useState } from "react";
import "./dropdown-menu.css";

const DropdownMenu = ({ options, defaultOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // close the dropdown
    if (onChange) onChange(option); // notify parent about the selection
  };

  return (
    <div className="dropdown-container-booking">
      <button
        className="dropdown-button-booking"
        onClick={() => setIsOpen(!isOpen)} // toggle dropdown visibility
      >
        {selectedOption} <span className="arrow">&#9662;</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu-booking">
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item-booking"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
