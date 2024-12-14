// coded by Danielle Wahrhaftig
import React, { useState } from "react";
import { ReactComponent as MailIcon } from "../../svg/mail.svg";
import { ReactComponent as CheckIcon } from "../../svg/check.svg";
import { ReactComponent as XIcon } from "../../svg/cross.svg";
import { ReactComponent as KeyIcon } from "../../svg/key.svg";
import { useNavigate } from "react-router-dom";
import "./login-form.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(null); // null: initial, true: valid, false: invalid
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

  const validateEmail = (email) => {
    const mcgillEmailRegex = /^[^\s@]+@(mail\.)?mcgill\.ca$/;
    setIsEmailValid(mcgillEmailRegex.test(email));
  };
  const validatePassword = (password) => {
    setIsPasswordValid(password.length >= 8);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmailValid && isPasswordValid) {
      try {
        const response = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("firstName", `${data.user.firstName}`);
          localStorage.setItem("lastName", `${data.user.lastName}`);
          localStorage.setItem("email", `${data.user.email}`);
          localStorage.setItem("isFaculty", `${data.user.isFaculty}`);
          window.open("/", "_self");
        } else {
          setErrorMessage(data.message || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessage("An error occurred. Please try again later.");
      }
    } else {
      setErrorMessage("Please enter a valid email and password.");
    }
  };

  const renderIcon = (isValid, type) => {
    if (isValid === null) {
      return type === "email" ? (
        <MailIcon className="input-icon" />
      ) : (
        <KeyIcon className="input-icon" />
      );
    }
    return isValid ? (
      <CheckIcon className="input-icon valid-icon" />
    ) : (
      <XIcon className="input-icon invalid-icon" />
    );
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          {renderIcon(isEmailValid, "email")}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          {renderIcon(isPasswordValid, "password")}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            minLength="8" // Enforces minimum length at the browser level
          />
        </div>
        <div className="form-group-two">
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label htmlFor="rememberMe" className="remember-me-label">
              Remember Me
            </label>
          </div>
          <div className="forgot-password">
            <a href="">Forgot your password?</a>
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
      <p className="login-footer">
        Don't have an account?{" "}
        <a href="/signup">
          <strong>Sign up here</strong>
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
