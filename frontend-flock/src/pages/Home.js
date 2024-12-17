// Emily Roest, 260960015
import React from "react";
import { ReactComponent as Gradient } from "../svg/flock-home.svg";
import { ReactComponent as Home1 } from "../svg/home-1.svg";
import { ReactComponent as Home2 } from "../svg/home-2.svg";
import { ReactComponent as Home3 } from "../svg/home-3.svg";
import scheduleVideo from '../assets/schedule.mp4';
import "../styles/home.css";

export default function Home() {
  const isFaculty = localStorage.getItem("isFaculty") === "true";

  return (
    <div className="home-container">
      <div className="top-section">
        <Gradient className="home-gradient" />
        <div className="overlay-text">
          <h1>
            Welcome to Flock, the McGill Computer Science Department's Booking
            System
          </h1>
          <p>
            Your place to connect with Professors, Teaching Assistants, and
            fellow Students
          </p>
          <div className="redirect-buttons">
            {isFaculty ? (
              <>
                <a href="/create">
                  <button className="overlay-buttons">Create Meeting</button>
                </a>
                <a href="/block">
                  <button className="overlay-buttons">Block Availability</button>
                </a>
                <a href="/book">
                  <button className="overlay-buttons">Book Meeting</button>
                </a>
                <a href="/dashboard">
                  <button className="overlay-buttons">Dashboard</button>
                </a>
              </>
            ) : (
              <>
              <a href="/book">
                <button className="overlay-buttons">Book Meeting</button>
              </a>
              <a href="/dashboard">
              <button className="overlay-buttons">Dashboard</button>
              </a>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="middle-section">
        <div className="left-panel">
          <h2>Scheduling made easy with Flock</h2>
          <ul className="features">
            <li>Customize your personal dashboard</li>
            <li>Set your availability</li>
            <li>Choose your meeting type</li>
            <li>Cancel and reschedule with ease</li>
            <li>See meeting history and upcoming events</li>
          </ul>
        </div>
        <div className="right-panel">
          <video
            src={scheduleVideo}
            className="schedule-video"
            autoPlay
            loop
            muted
            preload="auto"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="bottom-section-red">
        <h2> Get to know Flock </h2>
        <div className="images-row">
          <Home1 className="home-image" />
          <Home2 className="home-image" />
          <Home3 className="home-image" />
        </div>
      </div>
      <div className="bottom-section-grey">
        <div className="text-block">
          <h3>Create meetings</h3>
          <p>
            Faculty can schedule single, recurring, private, or public meetings
            to invite students
          </p>
        </div>

        <div className="text-block">
          <h3>Book meetings</h3>
          <p>
            Students can select meetings to attend from a faculty member's open
            schedule
          </p>
        </div>

        <div className="text-block">
          <h3>Meeting history</h3>
          <p>
            Upcoming and past are clearly displayed on a user-friendly
            dashboard, providing all the essential info at a glance
          </p>
        </div>
      </div>
    </div>
  );
}
