// coded by Danielle Wahrhaftig
import React, { useState, useEffect, useRef } from "react";
import "./dropdown-menu.css";

const DropdownMenu = ({ options, defaultOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isSelected, setIsSelected] = useState(false);

  const dropdownRef = useRef(null); // Ref to the dropdown container

  // sync dropdown state with the parent-provided defaultOption
  useEffect(() => {
    setSelectedOption(defaultOption);
  }, [defaultOption]);

  // Close the dropdown if a click occurs outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
        setIsSelected(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsSelected(true);
    setIsOpen(false);
    // setIsOpen(false); // Close the dropdown
    if (onChange) onChange(option); // Notify parent about the selection
  };

  const handleButtonClicked = () => {
    setIsOpen(!isOpen);
    setIsSelected(false);
  };

  return (
    <div className="dropdown-container-booking" ref={dropdownRef}>
      <button
        className={
          isSelected ? "dropdown-button-selected" : "dropdown-button-booking"
        }
        aria-expanded={isOpen}
        onClick={() => handleButtonClicked()} // Toggle dropdown visibility
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
