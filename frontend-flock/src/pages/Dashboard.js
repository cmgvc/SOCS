// Chloe Gavrilovic 260955835
import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import MeetingCard from "../components/MeetingCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ReactComponent as SettingsSvg } from "../svg/settings.svg";

function Dashboard() {
    const [state, setState] = useState({
        startNextIndex: 0,
        startPrevIndex: 0,
        startRequestedIndex: 0,
        filterOwnMeetings: false,
        upcomingMeetings: [],
        pastMeetings: [],
        requestedMeetings: [],
        availabilities: [],
        showLogoutModal: false,
        showConfirmationModal: false,
        selectedAvailabilityId: null
    });

    const email = localStorage.getItem("email");
    const isFaculty = localStorage.getItem("isFaculty") === "true";
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

    // navigation handlers
    const createNavigationHandler = (listKey, indexKey) => {
        return {
            next: () => {
                setState(prev => {
                    const list = prev[listKey];
                    const currentIndex = prev[indexKey];
                    return currentIndex + 3 < list.length 
                        ? { ...prev, [indexKey]: currentIndex + 1 }
                        : prev;
                });
            },
            prev: () => {
                setState(prev => {
                    const currentIndex = prev[indexKey];
                    return currentIndex > 0 
                        ? { ...prev, [indexKey]: currentIndex - 1 }
                        : prev;
                });
            }
        };
    };

    const upcomingNavigation = createNavigationHandler('upcomingMeetings', 'startNextIndex');
    const historyNavigation = createNavigationHandler('pastMeetings', 'startPrevIndex');
    const requestedNavigation = createNavigationHandler('requestedMeetings', 'startRequestedIndex');

    // logout and modal handlers
    const handleLogoutClick = () => setState(prev => ({ ...prev, showLogoutModal: true }));
    
    const handleConfirmLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleCancelLogout = () => setState(prev => ({ ...prev, showLogoutModal: false }));

    // faculty availability handlers
    const handleCancelAvailability = async (id) => {
        try {
            const res = await fetch(`${backendUrl}/availabilities/cancel`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: id }),
            });
    
            if (res.ok) {
                setState(prev => ({
                    ...prev,
                    availabilities: prev.availabilities.filter(availability => availability._id !== id),
                    showConfirmationModal: false
                }));
            } else {
                const errorMessage = await res.json();
                console.error("Failed to cancel availability:", errorMessage.message);
            }
        } catch (error) {
            console.error("Error canceling availability:", error);
        }
    };

    const openConfirmationModal = (id) => setState(prev => ({
        ...prev, 
        selectedAvailabilityId: id, 
        showConfirmationModal: true 
    }));

    const closeConfirmationModal = () => setState(prev => ({
        ...prev, 
        showConfirmationModal: false, 
        selectedAvailabilityId: null 
    }));

    // fetch meetings based on faculty or student role
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const endpoints = isFaculty 
                    ? ["/meetings", "/meetings/faculty"] // handles both meetings created by faculty as well as meetings they booked into other faculty members' availabilities
                    : ["/meetings"];
                const allMeetings = await Promise.all(
                    endpoints.map(endpoint => 
                        fetch(`${backendUrl}${endpoint}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                        }).then(res => res.json())
                    )
                );
        
                const meetings = isFaculty ? allMeetings.flat() : allMeetings[0];
                const currentTime = new Date();
        
                const uniqueMeetings = (meetings) => 
                    Array.from(new Map(meetings.map(meeting => [meeting._id, meeting])).values());
        
                const sortAndFilterMeetings = (filter, dateComparator = (a, b) => new Date(a.date) - new Date(b.date)) => {
                    return uniqueMeetings(meetings.filter(filter))
                        .sort(dateComparator);
                };
                // separate meetings into upcoming, past, and requested
                const upcoming = sortAndFilterMeetings(
                    meeting => new Date(meeting.date) > currentTime && 
                               meeting.status !== "Pending" && 
                               meeting.status !== "Declined"
                );
        
                const past = sortAndFilterMeetings(
                    meeting => new Date(meeting.date) <= currentTime,
                    (a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
        
                        if (dateA.getTime() === dateB.getTime()) {
                            const timeA = a.time ? a.time.split(":").map(Number) : [0, 0];
                            const timeB = b.time ? b.time.split(":").map(Number) : [0, 0];
        
                            return dateB.getTime() === dateA.getTime() 
                                ? (timeB[0] === timeA[0] ? timeB[1] - timeA[1] : timeB[0] - timeA[0])
                                : dateB - dateA;
                        }
        
                        return dateB - dateA;
                    }
                );
        
                const requested = sortAndFilterMeetings(
                    meeting => meeting.status === "Pending" || 
                               (!isFaculty && meeting.status === "Declined")
                );
        
                setState(prev => ({
                    ...prev,
                    upcomingMeetings: upcoming,
                    pastMeetings: past,
                    requestedMeetings: requested
                }));
            } catch (error) {
                console.error("Error fetching meetings:", error);
            }
        };
    
        fetchMeetings();

        // check for past meetings every minute
        const interval = setInterval(() => {
            const currentTime = new Date();
            setState(prev => {
                const movedToPast = prev.requestedMeetings.filter(
                    meeting => new Date(meeting.date) <= currentTime
                );
                
                return {
                    ...prev,
                    pastMeetings: [...prev.pastMeetings, ...movedToPast]
                        .sort((a, b) => new Date(b.date) - new Date(a.date)),
                    requestedMeetings: prev.requestedMeetings.filter(
                        meeting => new Date(meeting.date) > currentTime
                    )
                };
            });
        }, 60000);
    
        return () => clearInterval(interval);
    }, [email, isFaculty]);

    // fetch availabilities for faculty members 
    useEffect(() => {
        const fetchAvailabilities = async () => {
            if (isFaculty) {
                try {
                    const res = await fetch(`${backendUrl}/availabilities`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    });
                    const data = await res.json();
                    setState(prev => ({ ...prev, availabilities: data }));
                } catch (error) {
                    console.error("Error fetching availabilities:", error);
                }
            }
        };
        fetchAvailabilities();
    }, [email, isFaculty]);

    const renderMeetingSection = (
        meetings, 
        navigation, 
        startIndex, 
        title, 
        additionalButtons = null,
        filterFn = null
    ) => {
        const displayedMeetings = filterFn 
            ? meetings.filter(filterFn).slice(startIndex, startIndex + 3)
            : meetings.slice(startIndex, startIndex + 3);

        return (
            <div className="dash-section">
                <div className="dash-header">
                    <h2>{title}</h2>
                    {additionalButtons}
                </div>
                <div className="upcoming-panel">
                    {displayedMeetings.length > 0 && (
                        <>
                            <button
                                onClick={navigation.prev}
                                disabled={startIndex === 0}
                                className="panel-arrow"
                            >
                                <ArrowBackIosIcon />
                            </button>
                            <div className="meeting-cards">
                                {displayedMeetings.map((meeting) => (
                                    <MeetingCard 
                                        key={meeting._id} 
                                        meeting={meeting} 
                                        isFaculty={isFaculty}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={navigation.next}
                                disabled={startIndex + 3 >= meetings.length}
                                className="panel-arrow"
                            >
                                <ArrowForwardIosIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (!email) {
        return (
            <div className="dash-login">
                <h1>Sign in to view meeting history</h1>
                <a href="/auth">
                    <button>Login</button>
                </a>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard">
                <div className="dash-title">
                    <h1>Dashboard</h1>
                    <button onClick={handleLogoutClick}>Logout</button>
                    <br /><br />
                    <a href="/settings">{<SettingsSvg className="settings-icon" />}</a>
                </div>
                <div className="dash-overview">
                    {renderMeetingSection(
                        state.upcomingMeetings, 
                        upcomingNavigation, 
                        state.startNextIndex, 
                        "Upcoming Meetings",
                        <>
                            {isFaculty && (
                                <button onClick={() => setState(prev => ({ 
                                    ...prev, 
                                    filterOwnMeetings: !prev.filterOwnMeetings 
                                }))}>
                                    {state.filterOwnMeetings ? "Show All Meetings" : "Show My Meetings Only"}
                                </button>)}
                            {!isFaculty && (
                                <a href="meetingRequest">
                                    <button>Request alternate meeting time</button>
                                </a>
                            )}
                        </>,
                        state.filterOwnMeetings 
                            ? meeting => meeting.faculty === email 
                            : null
                    )}

                    {renderMeetingSection(
                        state.requestedMeetings, 
                        requestedNavigation, 
                        state.startRequestedIndex, 
                        "Requested Meetings"
                    )}

                    {renderMeetingSection(
                        state.pastMeetings, 
                        historyNavigation, 
                        state.startPrevIndex, 
                        "Past Meetings"
                    )}

                    {isFaculty && (
                        <div className="dash-section">
                            <h2>My Availabilities</h2>
                            <div className="availabilities-panel">
                                {state.availabilities.length > 0 ? (
                                    state.availabilities
                                        .filter(availability => 
                                            !availability.doesRepeatWeekly || 
                                            Object.values(availability.availabilityData).some(slots => slots.length > 0)
                                        )
                                        .map(availability => (
                                            <div 
                                                className="availability-card" 
                                                key={availability._id}
                                            >
                                                <div className="availability-info">
                                                    <h3>{availability.title || "Availability"}</h3>
                                                    <p>
                                                        Repeats Weekly: {availability.doesRepeatWeekly ? "Yes" : "No"}
                                                    </p>
                                                    {Object.entries(availability.availabilityData).map(
                                                        ([day, slots]) => 
                                                            slots.length > 0 && (
                                                                <div key={day}>
                                                                    <h4>{day}</h4>
                                                                    {slots.map((slot, index) => (
                                                                        <p key={index}>
                                                                            {slot.start} - {slot.end}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )
                                                    )}
                                                    <a href={availability.bookingUrl}>{availability.bookingUrl}</a>
                                                    <br />
                                                    <button 
                                                        className="cancel-btn" 
                                                        onClick={() => openConfirmationModal(availability._id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <p>No availabilities to display.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {state.showLogoutModal && (
                <div className="logout-modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to log out?</h3>
                        <button onClick={handleConfirmLogout}>Yes</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={handleCancelLogout}>No</button>
                    </div>
                </div>
            )}

            {state.showConfirmationModal && (
                <div className="availability-modal-overlay">
                    <div className="availability-modal">
                        <h3>Are you sure?</h3>
                        <p>Do you really want to cancel this availability?</p>
                        <div className="modal-actions">
                            <button 
                                onClick={() => handleCancelAvailability(state.selectedAvailabilityId)}
                            >
                                Yes, Cancel
                            </button>
                            <button onClick={closeConfirmationModal}>No, Go Back</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;