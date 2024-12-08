import React, { useEffect } from "react";
import { ReactComponent as UserIcon } from "../svg/user-1.svg";
import { ReactComponent as MailIcon } from "../svg/mail.svg";
import { ReactComponent as KeyIcon } from "../svg/key.svg";

import "./signup-form.css";

const SignupForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  useEffect(() => {
    document.body.classList.add("signup-body");

    return () => {
      document.body.classList.remove("signup-body");
    };
  }, []);

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <UserIcon className="input-icon" />
          <input type="text" placeholder="Name" required />
        </div>
        <div className="form-group">
          <MailIcon className="input-icon" />
          <input type="email" placeholder="Email" required />
        </div>
        <div className="form-group">
          <KeyIcon className="input-icon" />
          <input type="password" placeholder="Password" required />
        </div>
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>

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
