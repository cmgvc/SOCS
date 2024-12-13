import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import CreateBooking from "./pages/CreateBooking";
import Footer from "./components/Footer";
import ProfLookup from "./private/ProfLookup";
import MeetingRequest from "./private/MeetingRequest";
import BookMeeting from "./pages/BookMeeting";
import BlockCalendar from "./pages/BlockCalendar";
import Dashboard from "./pages/Dashboard";

function App() {
  localStorage.setItem("firstName", "Paul");
  localStorage.setItem("lastName", "Paul");
  localStorage.setItem("token", "1234");
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/profLookup" element={<ProfLookup />} />
          <Route path="/meetingRequest" element={<MeetingRequest />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create" element={<CreateBooking />} />
          <Route path="/block" element={<BlockCalendar />} />
          <Route path="/book" element={<BookMeeting />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
