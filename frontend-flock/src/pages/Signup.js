import React from "react";
import SignupForm from "../components/SignupForm";
import { ReactComponent as Birds } from "../svg/birds2.svg";
import "./signup.css";

const Signup = () => {
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
