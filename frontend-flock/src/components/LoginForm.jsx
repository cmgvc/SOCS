import React from "react";
import { ReactComponent as UserIcon } from "../svg/user-1.svg";
import { ReactComponent as MailIcon } from "../svg/mail.svg";
import { ReactComponent as KeyIcon } from "../svg/key.svg";

import "./login-form.css";

const LoginForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
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

      <p className="login-footer">
        Already have an account?{" "}
        <a href="/auth">
          <strong>Log in here</strong>
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
