import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LearnerProfile.css"; // Reuse styles for sidebar and layout
import "./ViewBookings.css";  // Additional styles for bookings

const ViewBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userBookings = allBookings.filter(b => b.email === currentUser?.email);
    setBookings(userBookings);
  }, []);

  const currentBookings = bookings.filter(b => new Date(b.date) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.date) < new Date());

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/LearnerProfile")}>My Profile</li>
          <li className="active" onClick={() => navigate("/ViewBookings")}>View Bookings</li>
          <li onClick={() => navigate("/LearningMaterial")}>Learning Material</li>
          <li onClick={() => navigate("/Quiz")}>Take Quiz</li>
          <li onClick={() => navigate("/BookInstructor")}>Book Instructor</li>
          <li className="logout-item" onClick={handleLogout}>
            <span className="logout-icon">⎋</span> Logout
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="profile-content">
        <h1 className="profile-header">My Bookings</h1>
        <p className="profile-subheader">View your scheduled and past driving lessons</p>

        <div className="bookings-section">
          <div className="bookings-column">
            <h2>📅 Upcoming Bookings</h2>
            {currentBookings.length > 0 ? (
              currentBookings.map((b, index) => (
                <div key={index} className="booking-card upcoming">
                  <h4>{b.instructorName}</h4>
                  <p><strong>Date:</strong> {b.date}</p>
                  <p><strong>Time:</strong> {b.time}</p>
                  <p><strong>Vehicle:</strong> {b.vehicle}</p>
                </div>
              ))
            ) : (
              <p className="no-bookings">No upcoming bookings found.</p>
            )}
          </div>

          <div className="bookings-column">
            <h2>✅ Past Bookings</h2>
            {pastBookings.length > 0 ? (
              pastBookings.map((b, index) => (
                <div key={index} className="booking-card past">
                  <h4>{b.instructorName}</h4>
                  <p><strong>Date:</strong> {b.date}</p>
                  <p><strong>Time:</strong> {b.time}</p>
                  <p><strong>Vehicle:</strong> {b.vehicle}</p>
                </div>
              ))
            ) : (
              <p className="no-bookings">No past bookings found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookings;
