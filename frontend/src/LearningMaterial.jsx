import { useNavigate } from "react-router-dom";
import "./LearningMaterial.css"; // New styles
import pdf1 from "./pdfs/sample1.pdf";
import pdf2 from "./pdfs/sample2.pdf";

const LearningMaterial = () => {
  const navigate = useNavigate();

  const openPDF = (pdfUrl) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">DriveMaster</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/LearnerProfile")}>My Profile</li>
          <li onClick={() => navigate("/bookings")}>View Bookings</li>
          <li className="active" onClick={() => navigate("/learning-material")}>Learning Material</li>
          <li onClick={() => navigate("/quiz")}>Take Quiz</li>
          <li onClick={() => navigate("/book-instructor")}>Book Instructor</li>

        </ul>
      </div>

      {/* Content */}
      <div className="profile-content">
        <div className="profile-header-section">
          <h1 className="profile-header">Learning Material</h1>
        </div>
        <p className="profile-subheader">Access official learning PDFs to prepare for your lessons.</p>

        <div className="material-grid">
          <div className="material-card" onClick={() => openPDF(pdf1)}>
            <i className="fas fa-file-pdf material-icon red-icon"></i>
            <p className="material-title">Traffic Rules</p>
            <p className="material-desc">Get familiar with road rules and signals.</p>
          </div>

          <div className="material-card" onClick={() => openPDF(pdf2)}>
            <i className="fas fa-book-open material-icon blue-icon"></i>
            <p className="material-title">Driver Training Manual</p>
            <p className="material-desc">Understand the fundamentals of driving safely.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningMaterial;
