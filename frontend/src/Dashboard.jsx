import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Assuming you're using axios for API requests
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null); // To store fetched user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      navigate("/login"); // Redirect if no role found
    } else {
      setUserRole(storedRole);
    }

    // Fetch user data after determining role
    const fetchUserData = async () => {
      try {
        let response;
        if (storedRole === "learner") {
          response = await axios.get("http://localhost:8080/api/learner/LearnerProfile");
        } else if (storedRole === "instructor") {
          response = await axios.get("http://localhost:8080/api/instructor/InstructorProfile");
        }
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storedRole) {
      fetchUserData();  // Fetch data only when role is set
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; // Show loading spinner while fetching data
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userRole === "learner" ? "Learner" : "Instructor"}!</h2>

      {userData && (
        <div className="user-info">
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* Display other user data as needed */}
        </div>
      )}

      <div className="dashboard-buttons">
        {userRole === "learner" ? (
          <>
            <div className="dashboard-box" onClick={() => navigate("/profile")}>View Profile</div>
            <div className="dashboard-box" onClick={() => navigate("/bookings")}>View Bookings</div>
            <div className="dashboard-box" onClick={() => navigate("/learning-material")}>View Learning Material</div>
            <div className="dashboard-box" onClick={() => navigate("/quiz")}>Take Quiz</div>
            <div className="dashboard-box" onClick={() => navigate("/book-instructor")}>Book Instructor</div>
          </>
        ) : userRole === "instructor" ? (
          <>
            <div className="dashboard-box" onClick={() => navigate("/profile")}>View Profile</div>
            <div className="dashboard-box" onClick={() => navigate("/manage-lessons")}>Manage Lessons</div>
            <div className="dashboard-box" onClick={() => navigate("/booking-requests")}>Booking Requests</div>
            <div className="dashboard-box" onClick={() => navigate("/availability")}>Set Availability Schedule</div>
            <div className="dashboard-box" onClick={() => navigate("/ratings")}>View Ratings</div>
            <div className="dashboard-box" onClick={() => navigate("/earnings")}>View Earnings</div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
