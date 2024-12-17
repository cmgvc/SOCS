/* coded by Danielle Wahrhaftig */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";
import { ReactComponent as Tree } from "../svg/tree2.svg";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    document.body.classList.add("login-body");

    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  return (
    <div className="login-page">
      <Tree className="tree-background" />
      <div className="login-content">
        <h1 className="login-title">Welcome to Flock</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
