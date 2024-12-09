import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as UserIcon } from "../svg/user-1.svg";
import { ReactComponent as MailIcon } from "../svg/mail.svg";
import { ReactComponent as KeyIcon } from "../svg/key.svg";

import "./settings.css";

const Settings = () => {
  const navigate = useNavigate();

  // Load initial user data from localStorage
  const [userDetails, setUserDetails] = useState({
    name: `${localStorage.getItem("firstName") || ""} ${
      localStorage.getItem("lastName") || ""
    }`.trim(), // Combine first and last name
    email: localStorage.getItem("email") || "",
    password: "********", // Masked password for display
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Update localStorage and state after saving changes
  const updateLocalStorageAndState = (updatedDetails) => {
    const [firstName, ...lastNameParts] = updatedDetails.name.split(" ");
    const lastName = lastNameParts.join(" "); // Handle cases where the last name has spaces

    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("email", updatedDetails.email);

    setUserDetails({
      ...userDetails,
      ...updatedDetails,
      password: "********", // Keep password masked
    });

    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedDetails = {
      name: e.target.name.value,
      email: e.target.email.value,
    };

    try {
      const response = await fetch("http://localhost:5001/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...updatedDetails,
          password:
            e.target.password.value !== "********"
              ? e.target.password.value
              : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updateLocalStorageAndState(updatedDetails);
      } else {
        setErrorMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth"); // Redirect to login page
  };

  return (
    <div className="settings-form-container">
      <form className="settings-form" onSubmit={handleUpdate}>
        <h1 className="settings-title">Settings</h1>

        {/* Name */}
        <div className="form-group">
          <UserIcon className="input-icon" aria-label="User Icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userDetails.name}
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <MailIcon className="input-icon" aria-label="Mail Icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <KeyIcon className="input-icon" aria-label="Password Icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userDetails.password}
            onChange={(e) =>
              setUserDetails({ ...userDetails, password: e.target.value })
            }
            required
          />
        </div>

        {/* Success and Error Messages */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="button-group">
          <button type="submit" className="settings-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
