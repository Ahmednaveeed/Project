import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingRequests.css';

const BookingRequests = () => {
  const navigate = useNavigate();
  const [bookingRequests, setBookingRequests] = useState([]);
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

    // Get booking requests from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Filter pending booking requests for current instructor
    const instructorRequests = bookings.filter(booking => 
      booking.instructorId === currentUser.email && 
      booking.status === 'pending'
    );

    // Sort by date and time
    const sortedRequests = instructorRequests.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

    setBookingRequests(sortedRequests);
  }, [navigate]);

  const handleBookingAction = (bookingId, action) => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        return { ...booking, status: action };
      }
      return booking;
    });

    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookingRequests(prev => 
      prev.filter(request => request.id !== bookingId)
    );
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="booking-requests-page">
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/InstructorProfile')}>My Profile</li>
          <li onClick={() => navigate('/ManageLessons')}>Manage Lessons</li>
          <li className="active">Booking Requests</li>
          <li onClick={() => navigate('/Ratings')}>Ratings</li>
          <li onClick={() => navigate('/Earnings')}>Earnings</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="content-header">
          <h1>Booking Requests</h1>
          <div className="header-stats">
            <div className="stat-card">
              <i className="fas fa-clock"></i>
              <div className="stat-info">
                <span className="stat-value">{bookingRequests.length}</span>
                <span className="stat-label">Pending Requests</span>
              </div>
            </div>
          </div>
        </div>

        <div className="requests-grid">
          {bookingRequests.length > 0 ? (
            bookingRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="student-info">
                    <div className="student-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h3>{request.studentName}</h3>
                      <span className="request-type">New Booking Request</span>
                    </div>
                  </div>
                  <span className="request-date">
                    {formatDate(request.date)}
                  </span>
                </div>
                
                <div className="request-details">
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{request.time}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-hourglass-half"></i>
                    <span>{request.duration} hour(s)</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-car"></i>
                    <span>{request.vehicleType}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{request.location}</span>
                  </div>
                  {request.notes && (
                    <div className="request-notes">
                      <i className="fas fa-sticky-note"></i>
                      <p>{request.notes}</p>
                    </div>
                  )}
                </div>

                <div className="request-actions">
                  <button 
                    className="action-btn accept"
                    onClick={() => handleBookingAction(request.id, 'accepted')}
                  >
                    <i className="fas fa-check"></i>
                    Accept Request
                  </button>
                  <button 
                    className="action-btn reject"
                    onClick={() => handleBookingAction(request.id, 'rejected')}
                  >
                    <i className="fas fa-times"></i>
                    Reject Request
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-requests">
              <i className="fas fa-inbox"></i>
              <p>No pending booking requests</p>
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

export default BookingRequests; 