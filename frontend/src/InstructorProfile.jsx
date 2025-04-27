import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instructorService from './services/instructorService';
import './InstructorProfile.css';

const InstructorProfile = () => {
  const navigate = useNavigate();
  const [instructorData, setInstructorData] = useState({
    fullName: '',
    email: '',
    age: '',
    experience: '',
    hourlyRate: 1000,
    availability: true,
    vehicle: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [newRate, setNewRate] = useState(instructorData.hourlyRate);

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || user.role !== 'instructor') {
      navigate('/login');
    }
  }, [navigate]);

  // Load instructor data
  useEffect(() => {
    const loadInstructorData = async () => {
      try {
        const profileData = await instructorService.getProfile();
        if (profileData) {
          setInstructorData(profileData);
          setNewRate(profileData.hourlyRate);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadInstructorData();
  }, []);

  const handleSavePricing = async () => {
    try {
      await instructorService.updatePricing({ hourlyRate: newRate });
      const updatedData = { ...instructorData, hourlyRate: newRate };
      setInstructorData(updatedData);
      setShowPricingModal(false);
    } catch (err) {
      setError(err.message || 'Failed to update pricing');
    }
  };

  const toggleAvailability = async () => {
    try {
      await instructorService.updateAvailability(!instructorData.availability);
      const updatedData = {
        ...instructorData,
        availability: !instructorData.availability
      };
      setInstructorData(updatedData);
    } catch (err) {
      setError(err.message || 'Failed to update availability');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleEditProfile = () => {
    navigate('/EditProfile');
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword');
  };

  const handleAddVehicle = () => {
    navigate('/AddVehicle');
  };

  const handleViewRatings = () => {
    navigate('/Ratings');
  };

  const handleViewEarnings = () => {
    navigate('/Earnings');
  };

  const handleManageLessons = () => {
    navigate('/ManageLessons');
  };

  const handleBookingRequests = () => {
    navigate('/BookingRequests');
  };

  return (
    <div className="instructor-profile-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li className="active" onClick={() => navigateTo('/InstructorProfile')}>My Profile</li>
          <li onClick={handleManageLessons}>Manage Lessons</li>
          <li onClick={handleBookingRequests}>Booking Requests</li>
          <li onClick={handleAddVehicle}>Add Vehicle</li>
          <li onClick={handleViewRatings}>View Ratings</li>
          <li onClick={handleViewEarnings}>View Earnings</li>
          <li onClick={handleEditProfile}>Edit Profile</li>
          <li onClick={handleChangePassword}>Change Password</li>
          <li className="logout-item" onClick={handleLogout}>
            <span className="logout-icon">⎋</span> Logout
          </li>
        </ul>
      </div>

      <div className="profile-content">
        <h1 className="profile-header">Instructor Profile</h1>

        {/* Personal Information Section */}
        <div className="section-with-header">
          <div className="section-header">
            <h2 className="section-title">Personal Information</h2>
            <button 
              className="section-action-btn edit-btn"
              onClick={() => navigate('/InstructorEditProfile')}
            >
              Edit Profile
            </button>
          </div>
          <div className="profile-section">
            <div className="info-grid">
              <div className="info-pair">
                <div className="info-label">Full Name</div>
                <div className="info-value">{instructorData.fullName}</div>
              </div>
              <div className="info-pair">
                <div className="info-label">Age</div>
                <div className="info-value">{instructorData.age}</div>
              </div>
              <div className="info-pair">
                <div className="info-label">Email Address</div>
                <div className="info-value">{instructorData.email}</div>
              </div>
              <div className="info-pair">
                <div className="info-label">Experience</div>
                <div className="info-value">{instructorData.experience}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information Section */}
        <div className="section-with-header">
          <div className="section-header">
            <h2 className="section-title">Vehicle Information</h2>
            <div className="vehicle-actions">
              {instructorData.vehicle ? (
                <>
                  <button className="section-action-btn edit-btn" onClick={() => navigate('/add-vehicle')}>
                    Edit Vehicle
                  </button>
                  <button 
                    className="section-action-btn remove-btn"
                    onClick={() => {
                      const updatedData = {...instructorData, vehicle: null};
                      setInstructorData(updatedData);
                      localStorage.setItem('instructorData', JSON.stringify(updatedData));
                    }}
                  >
                    Remove Vehicle
                  </button>
                </>
              ) : (
                <button 
                  className="section-action-btn add-btn"
                  onClick={() => navigate('/AddVehicle')}
                >
                  Add Vehicle
                </button>
              )}
            </div>
          </div>
          <div className="profile-section">
            {instructorData.vehicle ? (
              <div className="info-grid">
                <div className="info-pair">
                  <div className="info-label">Vehicle Type</div>
                  <div className="info-value">
                    {instructorData.vehicle.vehicleType?.charAt(0).toUpperCase() + 
                     instructorData.vehicle.vehicleType?.slice(1)}
                  </div>
                </div>
                <div className="info-pair">
                  <div className="info-label">Make & Model</div>
                  <div className="info-value">
                    {instructorData.vehicle.makeModel}
                  </div>
                </div>
                <div className="info-pair">
                  <div className="info-label">Year</div>
                  <div className="info-value">
                    {instructorData.vehicle.year}
                  </div>
                </div>
                <div className="info-pair">
                  <div className="info-label">Transmission</div>
                  <div className="info-value">
                    {instructorData.vehicle.transmission?.charAt(0).toUpperCase() + 
                     instructorData.vehicle.transmission?.slice(1)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-info">No vehicle information added yet.</p>
            )}
          </div>
        </div>

        {/* Pricing & Availability Section */}
        <div className="section-with-header">
          <div className="section-header">
            <h2 className="section-title">Pricing & Availability</h2>
            <button 
              className="section-action-btn pricing-btn"
              onClick={() => setShowPricingModal(true)}
            >
              Edit Pricing
            </button>
          </div>
          <div className="profile-section">
            <div className="info-grid">
              <div className="info-pair">
                <div className="info-label">Hourly Rate</div>
                <div className="info-value">PKR {instructorData.hourlyRate} per hour</div>
              </div>
              <div className="info-pair">
                <div className="info-label">Current Availability Status:</div>
                <div className="info-value">
                  {instructorData.availability ? 'Available for Bookings' : 'Unavailable'}
                </div>
              </div>
            </div>
            <button 
              className={`availability-btn ${instructorData.availability ? 'unavailable' : 'available'}`}
              onClick={toggleAvailability}
            >
              Set as {instructorData.availability ? 'Unavailable' : 'Available'}
            </button>
          </div>
        </div>

        {/* Pricing Modal */}
        {showPricingModal && (
          <div className="modal-overlay">
            <div className="pricing-modal">
              <h3>Update Hourly Rate</h3>
              <input
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Enter new rate (PKR)"
              />
              <div className="modal-actions">
                <button onClick={() => setShowPricingModal(false)}>Cancel</button>
                <button onClick={handleSavePricing}>Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button className="action-btn" onClick={handleEditProfile}>
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
          <button className="action-btn" onClick={handleChangePassword}>
            <i className="fas fa-key"></i>
            Change Password
          </button>
          <button className="action-btn" onClick={handleViewRatings}>
            <i className="fas fa-star"></i>
            View Ratings
          </button>
          <button className="action-btn" onClick={handleViewEarnings}>
            <i className="fas fa-money-bill-wave"></i>
            View Earnings
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;