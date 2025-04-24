import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Prepare the request payload
      const loginData = {
        email,
        password,
        role,
      };

      // Make a POST request to the backend login endpoint
      const response = await axios.post("http://localhost:8080/api/auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If login is successful, save the token and user data
      if (response.status === 200) {
        const userData = response.data; // Adjust according to your backend response

        localStorage.setItem("authToken", userData.token); // Assuming backend sends a token
        localStorage.setItem("currentUser", JSON.stringify(userData));

        // Redirect based on the user role
        if (role === "instructor") {
          // Redirect to the instructor profile page
          navigate("/InstructorProfile");
        } else if (role === "learner") {
          // Redirect to the learner profile page
          navigate("/LearnerProfile");
        }
      }
    } catch (error) {
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

          <button className="login-button" onClick={handleLogin}>
            Login
          </button>

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
