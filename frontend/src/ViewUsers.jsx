import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewUsers.css';

const ViewUsers = ({ userType }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(allUsers.filter(user => user.role === userType));
  }, [userType]);

  const toggleSelectUser = (email) => {
    setSelectedUsers(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleDelete = () => {
    const updatedUsers = JSON.parse(localStorage.getItem('users'))
      .filter(user => !selectedUsers.includes(user.email));

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers.filter(user => user.role === userType));
    setSelectedUsers([]);
  };

  return (
    <div className="view-users-dashboard">
      {/* Sidebar */}
      <div className="view-users-sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/AdminProfile')}>Dashboard</li>
          <li onClick={() => navigate('/AdminLearners')}>View Learners</li>
          <li onClick={() => navigate('/AdminInstructors')}>View Instructors</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="view-users-content">
        <h1 className="view-users-header">
          {userType === 'learner' ? 'All Learners' : 'All Instructors'}
        </h1>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => toggleSelectUser(user.email)}
                    />
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>{new Date().toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUsers.length > 0 && (
          <div className="delete-section">
            <button onClick={handleDelete} className="delete-btn">
              🗑 Delete Selected ({selectedUsers.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
