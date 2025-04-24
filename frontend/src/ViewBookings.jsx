import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewBookings.css';

const ViewBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !localStorage.getItem("authToken")) {
      navigate("/login");
      return;
    }

    setUserEmail(currentUser.email);

    const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const userBookings = allBookings.filter(booking => booking.learnerEmail === currentUser.email);
    setBookings(userBookings);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const isPast = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">DriveMaster</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/LearnerProfile")}>My Profile</li>
          <li className="active">View Bookings</li>
          <li onClick={() => navigate("/learning-material")}>Learning Material</li>
          <li onClick={() => navigate("/quiz")}>Take Quiz</li>
          <li onClick={() => navigate("/book-instructor")}>Book Instructor</li>
          <li className="logout-item" onClick={handleLogout}>
            <span className="logout-icon">⎋</span> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <h1 className="profile-header">My Bookings</h1>
        <p className="profile-subheader">Below are your current and past bookings.</p>

        <div className="booking-grid">
          {bookings.length === 0 ? (
            <p className="no-booking-text">You have no bookings yet.</p>
          ) : (
            bookings.map((booking, index) => (
              <div
                key={index}
                className={`booking-card ${isPast(booking.date) ? "past" : "upcoming"}`}
              >
                <h3>{booking.instructorName}</h3>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Vehicle:</strong> {booking.vehicleType}</p>
                <span className="badge">{isPast(booking.date) ? "Past" : "Upcoming"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBookings;
