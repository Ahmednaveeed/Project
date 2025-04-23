import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add save logic here
    alert('Profile updated successfully!');
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
            placeholder=" "
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder=" "
          />
        </div>
        
        <div className="form-group">
          <label>Age</label>
          <input 
            type="number"  
            min="16"
            placeholder=" "
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