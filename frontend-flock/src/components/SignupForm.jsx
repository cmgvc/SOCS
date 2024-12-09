import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as UserIcon } from "../svg/user-1.svg";
import { ReactComponent as MailIcon } from "../svg/mail.svg";
import { ReactComponent as KeyIcon } from "../svg/key.svg";

import "./signup-form.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:5001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        localStorage.setItem("firstName", `${data.user.firstName}`);
        localStorage.setItem("lastName", `${data.user.lastName}`);
        localStorage.setItem("email", `${data.user.email}`);
        navigate("/dashboard"); // redirect to the dashboard
      } else {
        setErrorMessage(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    document.body.classList.add("signup-body");

    return () => {
      document.body.classList.remove("signup-body");
    };
  }, []);

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="form-group">
          <UserIcon className="input-icon" aria-label="User Icon" />
          <input type="text" name="name" placeholder="Name" required />
        </div>
        <div className="form-group">
          <MailIcon className="input-icon" aria-label="Mail Icon" />
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <div className="form-group">
          <KeyIcon className="input-icon" aria-label="Password Icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="signup-footer">
        Already have an account?{" "}
        <a href="/auth">
          <strong>Log in here</strong>
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
