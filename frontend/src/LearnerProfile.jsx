import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LearnerProfile.css';

const LearnerProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    age: '',
    accountType: 'User'
  });

  // Check authentication and load user data
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
      return;
    }

    // Load user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
      fullName: 'sauleh',
      email: '1221132@nu.edu.pk',
      age: '18',
      role: 'learner'
    };

    setUserData({
      fullName: currentUser.fullName,
      email: currentUser.email,
      age: currentUser.age,
      accountType: currentUser.role === 'instructor' ? 'Instructor' : 'User'
    });
  }, [navigate]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Clear only authentication-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li className="active" onClick={() => navigateTo('/LearnerProfile')}>My Profile</li>
          <li onClick={() => navigateTo('/bookings')}>View Bookings</li>
          <li onClick={() => navigate('/learning-material')}>Learning Material</li>
          <li onClick={() => navigateTo('/quiz')}>Take Quiz</li>
          <li onClick={() => navigate('/book-instructor')}>Book Instructor</li>
          <li className="logout-item" onClick={handleLogout}>
            <span className="logout-icon">⎋</span> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="profile-header-section">
          <h1 className="profile-header">My Profile</h1>
          <button className="edit-profile-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
        <p className="profile-subheader">Manage your personal information</p>

        {/* Personal Information Section */}
        <div className="profile-section">
          <h2 className="section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-label">Full Name</div>
              <div className="info-value">{userData.fullName}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Email Address</div>
              <div className="info-value">{userData.email}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Age</div>
              <div className="info-value">{userData.age}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Account Type</div>
              <div className="info-value">{userData.accountType}</div>
            </div>
          </div>
        </div>

        {/* Account Security Section */}
        <div className="profile-section">
          <h2 className="section-title">Account Security</h2>
          <div className="security-row">
            <div className="security-label">Password</div>
            <div className="password-display">••••••••</div>
          </div>
          <button className="change-password-btn" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnerProfile;