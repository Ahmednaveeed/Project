import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'learner',
    dateOfBirth: '',
    vehicleType: 'car',
    licenseNumber: '',
    yearsOfExperience: '',
    hourlyRate: 1000,
    vehicleTypes: ['car']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting registration with data:', formData);
      const response = await authService.register(formData);
      console.log('Registration response:', response);
      
      if (response.status === 201) {
        navigate('/login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || 'Registration failed. Please try again.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred while setting up the request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
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
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="learner">Learner</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          {formData.role === 'instructor' && (
            <>
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required={formData.role === 'instructor'}
                />
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required={formData.role === 'instructor'}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Hourly Rate (PKR)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Vehicle Types</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.vehicleTypes.includes('car')}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...formData.vehicleTypes, 'car']
                          : formData.vehicleTypes.filter(type => type !== 'car');
                        setFormData({ ...formData, vehicleTypes: newTypes });
                      }}
                    />
                    Car
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.vehicleTypes.includes('motorcycle')}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...formData.vehicleTypes, 'motorcycle']
                          : formData.vehicleTypes.filter(type => type !== 'motorcycle');
                        setFormData({ ...formData, vehicleTypes: newTypes });
                      }}
                    />
                    Motorcycle
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.vehicleTypes.includes('truck')}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...formData.vehicleTypes, 'truck']
                          : formData.vehicleTypes.filter(type => type !== 'truck');
                        setFormData({ ...formData, vehicleTypes: newTypes });
                      }}
                    />
                    Truck
                  </label>
                </div>
              </div>
            </>
          )}
          {formData.role === 'learner' && (
            <>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Preferred Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;