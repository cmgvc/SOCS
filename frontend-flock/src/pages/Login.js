import React from "react";
import LoginForm from "../components/LoginForm";
import "./login.css";

const Login = () => {
  return (
    <div className="login-page">
      <h1 class="login-title">Create a new Flock Account</h1>
      <LoginForm />
    </div>
  );
};

export default Login;
