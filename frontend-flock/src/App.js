import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import ProfLookup from "./private/ProfLookup"
import MeetingRequest from "./private/MeetingRequest"



function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/profLookup" element={<ProfLookup />} />
          <Route path="/meetingRequest" element={<MeetingRequest />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
