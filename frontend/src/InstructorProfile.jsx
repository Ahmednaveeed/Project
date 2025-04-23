import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const InstructorProfile = () => {
  
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem("userRole"));
  const [instructorData, setInstructorData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    pricing: "",
  });

  useEffect(() => {
    if (!userRole) {
      navigate("/login"); // Redirect if no userRole exists
    } else if (userRole !== "Instructor") {
      alert("Access Denied: You must be an instructor.");
      navigate("/dashboard"); // Redirect to dashboard if not an instructor
    } else {
      const storedData = JSON.parse(localStorage.getItem("instructorData"));
      if (storedData) {
        setInstructorData(storedData);
      }
    }
  }, [userRole, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Instructor Profile</h2>
      <p><strong>Name:</strong> {instructorData.name}</p>
      <p><strong>Age:</strong> {instructorData.age}</p>
      <p><strong>Email:</strong> {instructorData.email}</p>
      <p><strong>Password:</strong> {instructorData.password ? "********" : "Not Set"}</p>
      <p><strong>Pricing:</strong> ${instructorData.pricing} per lesson</p>

      <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
      <button onClick={() => navigate("/add-vehicle")}>Add Vehicle</button>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default InstructorProfile;
