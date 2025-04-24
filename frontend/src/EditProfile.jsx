import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: ''
  });

  // Load current user data on component mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
      fullName: '',
      email: '',
      age: ''
    };
    
    setFormData({
      fullName: currentUser.fullName,
      email: currentUser.email,
      age: currentUser.age
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Find and update the current user
    const updatedUsers = users.map(user => 
      user.email === currentUser.email ? { ...user, ...formData } : user
    );
    
    // Update localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify({
      ...currentUser,
      ...formData
    }));
    
    navigate('/LearnerProfile');
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Age</label>
          <input 
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="16"
            required
          />
        </div>
        
        <div className="button-group">
          <button type="button" onClick={() => navigate('/LearnerProfile')}>
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

export default EditProfile;