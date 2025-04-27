import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    setSuccess("");
  
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
  
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        fullName,
        email,
        age,
        password,
        role
      });
  
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Road Master</h1>
        <h2 className="login-subtitle">Register</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="login-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="16"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="learner">Learner</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <button className="login-button" onClick={handleRegister}>
            Register
          </button>
          
          <p className="register-text">
            Already have an account?{" "}
            <span 
              className="register-link" 
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;