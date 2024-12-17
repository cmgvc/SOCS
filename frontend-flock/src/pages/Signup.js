/* coded by Danielle Wahrhaftig */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/Signup/SignupForm";
import { ReactComponent as Birds } from "../svg/birds2.svg";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="signup-page">
      <Birds className="birds-background" />
      <div className="signup-content">
        <h1 className="signup-title">Create a new Flock Account</h1>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
