import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfile.css';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ learners: 0, instructors: 0 });
  const [isHovered, setIsHovered] = useState(null);

  const admins = [
    { 
      name: "Ahmed Naveed", 
      email: "i221132@nu.edu.pk",
      bio: "6th semester BSCS student",
      avatarColor: "#3498db"
    },
    { 
      name: "Muhammad Abbas", 
      email: "i221409@nu.edu.pk",
      bio: "6th semester BSCS student",
      avatarColor: "#e74c3c"
    }
  ];

  useEffect(() => {
    // Calculate user stats
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setStats({
      learners: users.filter(u => u.role === 'learner').length,
      instructors: users.filter(u => u.role === 'instructor').length
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentAdmin');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <div className="sidebar-menu">
          <div className="menu-item active" onClick={() => navigate('/AdminProfile')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/AdminLearners')}>
            <i className="fas fa-users"></i>
            <span>Learners</span>
            <span className="badge">{stats.learners}</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/AdminInstructors')}>
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Instructors</span>
            <span className="badge">{stats.instructors}</span>
          </div>
          <div className="menu-item logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <button className="btn-refresh">
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </header>

        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Welcome to Road Master Admin Panel!</h2>
            <p className="animated-text">
              Manage instructors, learners, and platform content with ease
            </p>
          </div>
          <div className="welcome-illustration">
            <i className="fas fa-shield-alt"></i>
          </div>
        </div>

        <div className="stats-cards">
          <div 
            className="stat-card learners"
            onMouseEnter={() => setIsHovered('learners')}
            onMouseLeave={() => setIsHovered(null)}
            onClick={() => navigate('/AdminLearners')}
          >
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>Learners</h3>
              <p className="count">{stats.learners}</p>
              <p className={`stat-desc ${isHovered === 'learners' ? 'visible' : ''}`}>
                View and manage all learner accounts
              </p>
            </div>
          </div>

          <div 
            className="stat-card instructors"
            onMouseEnter={() => setIsHovered('instructors')}
            onMouseLeave={() => setIsHovered(null)}
            onClick={() => navigate('/AdminInstructors')}
          >
            <div className="stat-icon">
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <div className="stat-info">
              <h3>Instructors</h3>
              <p className="count">{stats.instructors}</p>
              <p className={`stat-desc ${isHovered === 'instructors' ? 'visible' : ''}`}>
                Manage driving instructors
              </p>
            </div>
          </div>
        </div>

        <div className="admin-team">
          <h2>Admin Team</h2>
          <div className="team-cards">
            {admins.map((admin, index) => (
              <div className="team-card" key={index}>
                <div 
                  className="avatar" 
                  style={{ backgroundColor: admin.avatarColor }}
                >
                  {admin.name.charAt(0)}
                </div>
                <h3>{admin.name}</h3>
                <p className="email">{admin.email}</p>
                <p className="bio">{admin.bio}</p>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;