// Coded by Danielle Wahrhaftig 260984602
import React, { useState } from "react";
import { ReactComponent as UserIcon } from "../svg/user-1.svg";
import { ReactComponent as KeyIcon } from "../svg/key.svg";

import "./settings.css";

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    name: `${localStorage.getItem("firstName") || ""} ${
      localStorage.getItem("lastName") || ""
    }`.trim(), // Combine first and last name
    password: "********", // Masked password for display
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateLocalStorageAndState = (updatedDetails) => {
    const [firstName, ...lastNameParts] = updatedDetails.name.split(" ");
    const lastName = lastNameParts.join(" "); // handle cases where the last name has spaces

    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);

    setUserDetails({
      ...userDetails,
      ...updatedDetails,
      password: "********", // keep password masked
    });

    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000); // clear success message after 3 seconds
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedDetails = {
      name: e.target.name.value.trim(),
    };

    const email = localStorage.getItem("email");

    const nameParts = updatedDetails.name.split(" ");
    if (nameParts.length < 2) {
      setErrorMessage("Please provide both first and last name.");
      return;
    }

    // proceed with the update request
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

    try {
      const response = await fetch(`${backendUrl}/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...updatedDetails,
          email,
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

        {/* Email
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
        </div> */}

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
