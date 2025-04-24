import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Get form values
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Validation
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verify current password
    if (currentUser.password !== currentPassword) {
      setError("Current password is incorrect");
      return;
    }

    // Update password in users array
    const updatedUsers = users.map(user => 
      user.email === currentUser.email 
        ? { ...user, password: newPassword } 
        : user
    );

    // Update current user
    const updatedUser = { ...currentUser, password: newPassword };

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Show success and redirect
    setSuccess("Password changed successfully!");
    setTimeout(() => navigate('/LearnerProfile'), 1500);
  };

  return (
    <div className="change-password-container">
      <h1>Change Password</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input 
            type="password" 
            name="currentPassword" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>New Password</label>
          <input 
            type="password" 
            name="newPassword" 
            required 
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label>Confirm New Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            required 
          />
        </div>
        
        <div className="button-group">
          <button type="button" onClick={() => navigate('/LearnerProfile')}>
            Cancel
          </button>
          <button type="submit">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;