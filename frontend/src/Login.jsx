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
    if (role === 'admin' && email === 'admin@gmail.com' && password === '123456') {
      localStorage.setItem('authToken', 'mock-admin-token');
      localStorage.setItem('currentAdmin', JSON.stringify({
        name: 'Admin User',
        email: 'admin@gmail.com'
      }));
      navigate('/AdminProfile');
      return;
    }

    // Get all registered users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Find matching user
    const user = users.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );

    if (user) {
      // Set auth token and current user
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      // Redirect based on role
      if (role === "instructor") {
        // Initialize instructor data if doesn't exist
        if (!localStorage.getItem("instructorData")) {
          localStorage.setItem("instructorData", JSON.stringify({
            ...user,
            hourlyRate: 1000, // Default rate
            availability: true,
            experience: "Not specified",
            vehicle: null
          }));
        }
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