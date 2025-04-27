import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageLessons.css';

const ManageLessons = () => {
  const navigate = useNavigate();
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [currentInstructor, setCurrentInstructor] = useState(null);

  useEffect(() => {
    // Get current instructor from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.role === 'instructor') {
      setCurrentInstructor(currentUser);
    } else {
      navigate('/login');
      return;
    }

    // Get bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Filter bookings for current instructor and upcoming lessons
    const instructorBookings = bookings.filter(booking => 
      booking.instructorId === currentUser.email && 
      booking.status === 'upcoming'
    );

    // Sort by date and time
    const sortedBookings = instructorBookings.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

    setUpcomingLessons(sortedBookings);
  }, [navigate]);

  const handleStatusChange = (bookingId, newStatus) => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, status: newStatus };
      }
      return booking;
    });

    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setUpcomingLessons(prev => 
      prev.map(lesson => 
        lesson.id === bookingId 
          ? { ...lesson, status: newStatus }
          : lesson
      )
    );
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="manage-lessons-page">
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/InstructorProfile')}>My Profile</li>
          <li className="active">Manage Lessons</li>
          <li onClick={() => navigate('/BookingRequests')}>Booking Requests</li>
          <li onClick={() => navigate('/Ratings')}>Ratings</li>
          <li onClick={() => navigate('/Earnings')}>Earnings</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="content-header">
          <h1>Manage Upcoming Lessons</h1>
          <div className="header-stats">
            <div className="stat-card">
              <i className="fas fa-calendar-check"></i>
              <div className="stat-info">
                <span className="stat-value">{upcomingLessons.length}</span>
                <span className="stat-label">Upcoming Lessons</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lessons-grid">
          {upcomingLessons.length > 0 ? (
            upcomingLessons.map(lesson => (
              <div key={lesson.id} className="lesson-card">
                <div className="lesson-header">
                  <div className="student-info">
                    <div className="student-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h3>{lesson.learnerName}</h3>
                      <span className="lesson-type">Driving Lesson</span>
                    </div>
                  </div>
                  <span className={`status-badge ${lesson.status}`}>
                    {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                  </span>
                </div>
                
                <div className="lesson-details">
                  <div className="detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>{formatDate(lesson.date)}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{lesson.time}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-hourglass-half"></i>
                    <span>{lesson.duration} hour(s)</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{lesson.location}</span>
                  </div>
                  {lesson.notes && (
                    <div className="lesson-notes">
                      <i className="fas fa-sticky-note"></i>
                      <p>{lesson.notes}</p>
                    </div>
                  )}
                </div>

                <div className="lesson-actions">
                  <button 
                    className="action-btn complete"
                    onClick={() => handleStatusChange(lesson.id, 'completed')}
                  >
                    <i className="fas fa-check"></i>
                    Mark as Completed
                  </button>
                  <button 
                    className="action-btn cancel"
                    onClick={() => handleStatusChange(lesson.id, 'cancelled')}
                  >
                    <i className="fas fa-times"></i>
                    Cancel Lesson
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-lessons">
              <i className="fas fa-calendar-times"></i>
              <p>No upcoming lessons scheduled</p>
              <button className="refresh-btn" onClick={() => window.location.reload()}>
                <i className="fas fa-sync"></i>
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageLessons; 