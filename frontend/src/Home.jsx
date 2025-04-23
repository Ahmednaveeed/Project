import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <h1>Welcome to Road Master</h1>
        <p className="subtitle">Learn driving from certified professionals</p>
        <p className="tagline">Start your journey to becoming a confident driver today</p>
        
        <div className="buttons-container">
          <button 
            onClick={() => navigate("/login")} 
            className="home-button login-btn"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/register")} 
            className="home-button register-btn"
          >
            Register
          </button>
        </div>
      </div>
      
      <div className="road-animation"></div>
    </div>
  );
};

export default Home;