import React from "react";
import LoginForm from "../components/LoginForm";
import { ReactComponent as Birds } from "../svg/birds2.svg";
import "./login.css";

const Login = () => {
  return (
    <div className="login-page">
      <Birds className="birds-background" />
      <div className="login-content">
        <h1 className="login-title">Create a new Flock Account</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
