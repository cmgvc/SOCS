import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import MeetingCard from "../components/MeetingCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Dashboard() {
  const [startNextIndex, setStartNextIndex] = useState(0);
  const [startPrevIndex, setStartPrevIndex] = useState(0);
  const [startRequestedIndex, setStartRequestedIndex] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);
  const [requestedMeetings, setRequestedMeetings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const email = localStorage.getItem("email");
  const isFaculty = localStorage.getItem("isFaculty");
  const backendUrl = "http://localhost:5001";

  const getUpcomingDisplayedCards = upcomingMeetings.slice(
    startNextIndex,
    startNextIndex + 3
  );
  const getHistoryDisplayedCards = pastMeetings.slice(
    startPrevIndex,
    startPrevIndex + 3
  );
  const getRequestedDisplayedCards = requestedMeetings.slice(
    startRequestedIndex,
    startRequestedIndex + 3
  );

  const handleUpcomingNextClick = () => {
    if (startNextIndex + 3 < upcomingMeetings.length) {
      setStartNextIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleUpcomingPrevClick = () => {
    if (startNextIndex > 0) {
      setStartNextIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleHistoryNextClick = () => {
    if (startPrevIndex + 3 < pastMeetings.length) {
      setStartPrevIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleHistoryPrevClick = () => {
    if (startPrevIndex > 0) {
      setStartPrevIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleRequestedNextClick = () => {
    if (startRequestedIndex + 3 < requestedMeetings.length) {
      setStartRequestedIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleRequestedPrevClick = () => {
    if (startRequestedIndex > 0) {
      setStartRequestedIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const endpoint = "/meetings";
        if (isFaculty) {
          const endpoint = "/meetings/faculty";
        }
        console.log(`${backendUrl}${endpoint}`);
        const res = await fetch(`${backendUrl}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });
        const data = await res.json();

        const currentTime = new Date();

        const upcoming = data.filter(
          (meeting) =>
            new Date(meeting.date) > currentTime &&
            meeting.status !== "Pending" &&
            meeting.status !== "Declined"
        );
        const past = data.filter(
          (meeting) => new Date(meeting.date) <= currentTime
        );
        const requested = data.filter(
          (meeting) =>
            meeting.status === "Pending" ||
            (!isFaculty && meeting.status === "Declined")
        );

        setUpcomingMeetings(
          upcoming.sort((a, b) => new Date(a.date) - new Date(b.date))
        );
        setPastMeetings(
          past.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        setRequestedMeetings(
          requested.sort((a, b) => new Date(a.date) - new Date(b.date))
        );
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();

    const interval = setInterval(() => {
      const currentTime = new Date();
      setRequestedMeetings((prevRequested) => {
        const movedToPast = prevRequested.filter(
          (meeting) => new Date(meeting.date) <= currentTime
        );
        if (movedToPast.length > 0) {
          setPastMeetings((prevPast) =>
            [...movedToPast, ...prevPast].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )
          );
        }
        return prevRequested.filter(
          (meeting) => new Date(meeting.date) > currentTime
        );
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [email, isFaculty]);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (isFaculty === "true") {
        try {
          const res = await fetch(`${backendUrl}/availabilities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
          });
          const data = await res.json();
          setAvailabilities(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching availabilities:", error);
        }
      }
    };
    fetchAvailabilities();
  }, [email, isFaculty]);

  return (
    <>
      {email ? (
        <div className="dashboard">
          <div className="dash-title">
            <h1>Dashboard</h1>
            <button onClick={handleLogoutClick}>Logout</button>
          </div>
          <div className="dash-overview">
            <div className="dash-section">
              <div className="dash-header">
                <h2>Upcoming Meetings</h2>
                {!isFaculty && (
                <a href="meetingRequest">
                  <button>Request alternate meeting time</button>
                </a>)}
              </div>
              <div className="upcoming-panel">
                {upcomingMeetings.length > 0 && (
                  <>
                    <button
                      onClick={handleUpcomingPrevClick}
                      disabled={startNextIndex === 0}
                      className="panel-arrow"
                    >
                      <ArrowBackIosIcon />
                    </button>
                    <div className="meeting-cards">
                      {getUpcomingDisplayedCards.map((meeting) => (
                        <MeetingCard
                          key={meeting._id || meeting.title}
                          meeting={meeting}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleUpcomingNextClick}
                      disabled={startNextIndex + 3 >= upcomingMeetings.length}
                      className="panel-arrow"
                    >
                      <ArrowForwardIosIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="dash-section">
              <div className="dash-header">
                <h2>Requested Meetings</h2>
              </div>
              <div className="upcoming-panel">
                {requestedMeetings.length > 0 && (
                  <>
                    <button
                      onClick={handleRequestedPrevClick}
                      disabled={startRequestedIndex === 0}
                      className="panel-arrow"
                    >
                      <ArrowBackIosIcon />
                    </button>
                    <div className="meeting-cards">
                      {getRequestedDisplayedCards.map((meeting) => (
                        <MeetingCard
                          key={meeting._id}
                          meeting={meeting}
                          isFaculty={isFaculty}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleRequestedNextClick}
                      disabled={
                        startRequestedIndex + 3 >= requestedMeetings.length
                      }
                      className="panel-arrow"
                    >
                      <ArrowForwardIosIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="dash-section">
              <div className="dash-header">
                <h2>Past Meetings</h2>
              </div>
              <div className="upcoming-panel">
                {pastMeetings.length > 0 && (
                  <>
                    <button
                      onClick={handleHistoryPrevClick}
                      disabled={startPrevIndex === 0}
                      className="panel-arrow"
                    >
                      <ArrowBackIosIcon />
                    </button>
                    <div className="meeting-cards">
                      {getHistoryDisplayedCards.map((meeting) => (
                        <MeetingCard key={meeting._id} meeting={meeting} />
                      ))}
                    </div>
                    <button
                      onClick={handleHistoryNextClick}
                      disabled={startPrevIndex + 3 >= pastMeetings.length}
                      className="panel-arrow"
                    >
                      <ArrowForwardIosIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {isFaculty === "true" && (
            <div className="dash-availabilities">
              <h2>My Availabilities</h2>
              <br />
              {availabilities.length > 0 ? (
                <ul>
                  {availabilities.map((availability) => (
                    <>
                      {" "}
                      <a href={availability.bookingUrl}>
                        {decodeURIComponent(availability.bookingUrl)}
                      </a>
                      <br />
                      <br />
                    </>
                  ))}
                </ul>
              ) : (
                <p>No availabilities available.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="dash-login">
          <h1>Sign in to view meeting history</h1>
          <a href="/auth">
            <button>Login</button>
          </a>
        </div>
      )}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="modal-content">
            <h3>Are you sure you want to log out?</h3>
            <button onClick={handleConfirmLogout}>Yes</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={handleCancelLogout}>No</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
