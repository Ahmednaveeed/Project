import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
  
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
        role
      });
  
      // Optional: you can use token from res.data.token if implemented
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("currentUser", JSON.stringify(res.data));
  
      if (role === "admin") {
        navigate("/AdminProfile");
      } else if (role === "instructor") {
        navigate("/InstructorProfile");
      } else {
        navigate("/LearnerProfile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials!");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Road Master</h1>
        <h2 className="login-subtitle">Login to Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="learner">Learner</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="login-button" onClick={handleLogin}>Login</button>
          
          <p className="register-text">
            Don't have an account?{" "}
            <span className="register-link" onClick={() => navigate("/register")}>
              Register now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;