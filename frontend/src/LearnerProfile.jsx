import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import learnerService from './services/learnerService';
import './LearnerProfile.css';

const LearnerProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    age: '',
    phoneNumber: '',
    address: null,
    preferredVehicleType: '',
    profilePicture: '',
    learningProgress: null,
    bookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || user.role !== 'learner') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profileData = await learnerService.getProfile();
        if (profileData) {
          setUserData(profileData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEditProfile = () => {
    navigate('/EditProfile');
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li className="active" onClick={() => navigateTo('/LearnerProfile')}>My Profile</li>
          <li onClick={() => navigateTo('/ViewBookings')}>View Bookings</li>
          <li onClick={() => navigateTo('/LearningMaterial')}>Learning Material</li>
          <li onClick={() => navigateTo('/Quiz')}>Take Quiz</li>
          <li onClick={() => navigateTo('/BookInstructor')}>Book Instructor</li>
          <li onClick={handleEditProfile}>Edit Profile</li>
          <li onClick={handleChangePassword}>Change Password</li>
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

        {/* Profile Picture */}
        {userData.profilePicture && (
          <div className="profile-picture-section">
            <img 
              src={userData.profilePicture} 
              alt="Profile" 
              className="profile-picture"
            />
          </div>
        )}

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
              <div className="info-label">Phone Number</div>
              <div className="info-value">{userData.phoneNumber}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Age</div>
              <div className="info-value">{userData.age}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Address</div>
              <div className="info-value">
                {userData.address ? (
                  typeof userData.address === 'string' 
                    ? userData.address 
                    : `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''} ${userData.address.zipCode || ''}`
                ) : 'Not provided'}
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Preferred Vehicle Type</div>
              <div className="info-value">{userData.preferredVehicleType || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Learning Progress Section */}
        {userData.learningProgress && (
          <div className="profile-section">
            <h2 className="section-title">Learning Progress</h2>
            <div className="progress-grid">
              <div className="progress-row">
                <div className="progress-label">Completed Lessons</div>
                <div className="progress-value">
                  {userData.learningProgress.completedLessons?.length || 0}
                </div>
              </div>
              {/* Add more progress metrics as needed */}
            </div>
          </div>
        )}

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