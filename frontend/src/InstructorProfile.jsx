import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [newRate, setNewRate] = useState(instructorData.hourlyRate);

  // Check authentication on load
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
  }, [navigate]);

  // Load instructor data
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('instructorData'));
    if (storedData) {
      setInstructorData(storedData);
      setNewRate(storedData.hourlyRate);
    }
  }, []);

  const handleSavePricing = () => {
    const updatedData = { ...instructorData, hourlyRate: newRate };
    setInstructorData(updatedData);
    localStorage.setItem('instructorData', JSON.stringify(updatedData));
    setShowPricingModal(false);
  };

  const toggleAvailability = () => {
    const updatedData = {
      ...instructorData,
      availability: !instructorData.availability
    };
    setInstructorData(updatedData);
    localStorage.setItem('instructorData', JSON.stringify(updatedData));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="instructor-profile-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li className="active">My Profile</li>
          <li onClick={() => navigate('/manage-lessons')}>Manage Lessons</li>
          <li onClick={() => navigate('/booking-requests')}>Booking Requests</li>
          <li onClick={() => navigate('/ratings')}>Ratings</li>
          <li onClick={() => navigate('/earnings')}>Earnings</li>
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
                  onClick={() => navigate('/add-vehicle')}
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
      </div>
    </div>
  );
};

export default InstructorProfile;