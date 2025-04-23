import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const storedRole = localStorage.getItem("userRole");

    if (email === storedEmail && password === storedPassword && role === storedRole) {
      // Redirect based on role
      if (role === "instructor") {
        navigate("/InstructorProfile");
      } else {
        navigate("/LearnerProfile");
      }
    } else {
      setError("Invalid login credentials!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Road Master</h1>
        <h2 className="login-subtitle">Login to Your Account</h2>
        
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