import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructorEditProfile.css';

const InstructorEditProfile = () => {
  const navigate = useNavigate();
  const [instructorData, setInstructorData] = useState({
    fullName: '',
    email: '',
    age: '',
    experience: 'amateur', // Default to amateur
    hourlyRate: 0,
    vehicleType: '',
    vehicleModel: ''
  });

  // Experience options
  const experienceLevels = [
    { value: 'amateur', label: 'Amateur (0-2 years)' },
    { value: 'professional', label: 'Professional (3-5 years)' },
    { value: 'expert', label: 'Expert (5+ years)' }
  ];

  // Load current instructor data
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('instructorData')) || {
      fullName: 'sauleh',
      email: 't221132@nu.edu.pk',
      age: '18',
      experience: 'amateur',
      hourlyRate: 0,
      vehicleType: '',
      vehicleModel: ''
    };
    setInstructorData(storedData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('instructorData', JSON.stringify(instructorData));
    navigate('/InstructorProfile');
  };

  return (
    <div className="instructor-edit-container">
      <h1>Edit Instructor Profile</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="form-section">
          <h2>Personal Information</h2>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={instructorData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={instructorData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={instructorData.age}
              onChange={handleChange}
              min="18"
            />
          </div>
          
          <div className="form-group">
            <label>Experience Level</label>
            <select
              name="experience"
              value={instructorData.experience}
              onChange={handleChange}
              className="experience-dropdown"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/InstructorProfile')}>
            Cancel
          </button>
          <button type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorEditProfile;