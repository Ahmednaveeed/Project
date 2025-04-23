import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Get form values
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Basic validation
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    // Here you would typically:
    // 1. Verify current password (API call)
    // 2. Update password (API call)
    // 3. Handle success/error cases

    // For now, just show success and redirect
    alert("Password changed successfully!");
    navigate('/LearnerProfile');
  };

  return (
    <div className="change-password-container">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <label>Current Password</label>
        <input 
          type="password" 
          name="currentPassword" 
          required 
        />
        
        <label>New Password</label>
        <input 
          type="password" 
          name="newPassword" 
          required 
          minLength="6"
        />
        
        <label>Confirm New Password</label>
        <input 
          type="password" 
          name="confirmPassword" 
          required 
        />
        
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