import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.firstName}!</h2>

      <div className="dashboard-buttons">
        {user.role === "learner" ? (
          <>
            <div className="dashboard-box" onClick={() => handleNavigation("/learner-profile")}>
              View Profile
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/ViewBookings")}>
              <h3>View Bookings</h3>
              <p>Check your scheduled lessons</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/LearningMaterials")}>
              <h3>Learning Materials</h3>
              <p>Access study materials</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/Quiz")}>
              <h3>Take Quiz</h3>
              <p>Test your knowledge</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/BookInstructor")}>
              <h3>Book Instructor</h3>
              <p>Schedule a lesson</p>
            </div>
          </>
        ) : user.role === "instructor" ? (
          <>
            <div className="dashboard-box" onClick={() => handleNavigation("/InstructorProfile")}>
              <h3>View Profile</h3>
              <p>Manage your instructor profile</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/ManageLessons")}>
              <h3>Manage Lessons</h3>
              <p>Schedule and manage lessons</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/BookingRequests")}>
              <h3>Booking Requests</h3>
              <p>View and manage booking requests</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/InstructorEditProfile")}>
              <h3>Set Availability</h3>
              <p>Update your schedule</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/AddVehicle")}>
              <h3>Add Vehicle</h3>
              <p>Register your vehicles</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/Ratings")}>
              <h3>View Ratings</h3>
              <p>Check your ratings and reviews</p>
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/Earnings")}>
              <h3>View Earnings</h3>
              <p>Track your earnings</p>
            </div>
          </>
        ) : user.role === "admin" ? (
          <>
            <div className="dashboard-box" onClick={() => handleNavigation("/admin-profile")}>
              View Profile
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/admin/learners")}>
              Manage Learners
            </div>
            <div className="dashboard-box" onClick={() => handleNavigation("/admin/instructors")}>
              Manage Instructors
            </div>
          </>
        ) : null}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
