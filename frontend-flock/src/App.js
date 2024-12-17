import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import BookingPage from "./components/BookMeeting/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
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
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/block"
            element={
              <ProtectedRoute>
                <BlockCalendar />
              </ProtectedRoute>
            }
          />
          <Route path="/book" element={<BookMeeting />} />
          <Route path="/booking/:email/:token" element={<BookingPage />} />
        </Routes>
        <ConditionalFooter />
      </Router>
    </div>
  );
}

function ConditionalFooter() {
  const location = useLocation();

  // List of routes where the footer should NOT be displayed
  const noFooterRoutes = ["/auth", "/signup"];

  if (noFooterRoutes.includes(location.pathname)) {
    return null; // do not render the footer
  }

  return <Footer />;
}

export default App;
