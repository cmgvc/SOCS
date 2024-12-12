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

  return (
    <div className="dropdown-container-booking" ref={dropdownRef}>
      <button
        className={
          isSelected ? "dropdown-button-selected" : "dropdown-button-booking"
        }
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
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

// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";

// const DropdownMenu = ({ options, defaultOption, onChange }) => {
//   const [selectedOption, setSelectedOption] = useState(defaultOption);

//   // Sync dropdown state with the parent-provided defaultOption
//   useEffect(() => {
//     setSelectedOption(defaultOption);
//   }, [defaultOption]);

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//     if (onChange) onChange(option);
//   };

//   return (
//     <div className="dropdown-container">
//       <button className="dropdown-button">
//         {selectedOption} <span className="arrow">&#9662;</span>
//       </button>
//       <ul className="dropdown-menu">
//         {options.map((option, index) => (
//           <li
//             key={index}
//             onClick={() => handleOptionClick(option)}
//             className="dropdown-item"
//           >
//             {option}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// DropdownMenu.propTypes = {
//   options: PropTypes.arrayOf(PropTypes.string).isRequired,
//   defaultOption: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

// export default DropdownMenu;
