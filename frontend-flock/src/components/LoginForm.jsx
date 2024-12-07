import React from "react";
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
          <input type="text" placeholder="Name" required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email" required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" required />
        </div>
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>

      <p className="login-footer">
        Already have an account? <a href="/auth">Log in here</a>
      </p>
    </div>
  );
};

export default LoginForm;
