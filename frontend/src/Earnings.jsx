import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Earnings.css';

const Earnings = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    weeklyEarnings: 0,
    bookings: []
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    loadEarnings();
  }, [timeFilter]);

  const loadEarnings = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Get all bookings from localStorage
    const allBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Filter bookings for current instructor that are accepted
    const instructorBookings = allBookings.filter(booking => 
      booking.instructorEmail === currentUser.email && 
      booking.status === 'accepted'
    );

    // Get learner details for each booking
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const bookingsWithLearnerDetails = instructorBookings.map(booking => {
      const learner = users.find(user => user.email === booking.learnerEmail);
      return {
        ...booking,
        learnerName: learner ? learner.fullName : 'Unknown Learner',
        date: new Date(booking.date)
      };
    });

    // Calculate earnings based on time filter
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let filteredBookings = bookingsWithLearnerDetails;
    if (timeFilter === 'month') {
      filteredBookings = bookingsWithLearnerDetails.filter(booking => booking.date >= oneMonthAgo);
    } else if (timeFilter === 'week') {
      filteredBookings = bookingsWithLearnerDetails.filter(booking => booking.date >= oneWeekAgo);
    }

    // Calculate total earnings
    const totalEarnings = bookingsWithLearnerDetails.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const monthlyEarnings = bookingsWithLearnerDetails
      .filter(booking => booking.date >= oneMonthAgo)
      .reduce((sum, booking) => sum + booking.totalAmount, 0);
    const weeklyEarnings = bookingsWithLearnerDetails
      .filter(booking => booking.date >= oneWeekAgo)
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    setEarnings({
      totalEarnings,
      monthlyEarnings,
      weeklyEarnings,
      bookings: filteredBookings.sort((a, b) => b.date - a.date) // Sort by date, newest first
    });
    setLoading(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading earnings data...</div>;
  }

  return (
    <div className="earnings-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/InstructorProfile')}>My Profile</li>
          <li onClick={() => navigate('/ManageLessons')}>Manage Lessons</li>
          <li onClick={() => navigate('/BookingRequests')}>Booking Requests</li>
          <li onClick={() => navigate('/Ratings')}>Ratings</li>
          <li className="active">Earnings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>My Earnings</h1>
          <div className="time-filter">
            <button 
              className={timeFilter === 'all' ? 'active' : ''} 
              onClick={() => setTimeFilter('all')}
            >
              All Time
            </button>
            <button 
              className={timeFilter === 'month' ? 'active' : ''} 
              onClick={() => setTimeFilter('month')}
            >
              This Month
            </button>
            <button 
              className={timeFilter === 'week' ? 'active' : ''} 
              onClick={() => setTimeFilter('week')}
            >
              This Week
            </button>
          </div>
        </div>

        <div className="earnings-summary">
          <div className="summary-card total">
            <h3>Total Earnings</h3>
            <p className="amount">PKR {earnings.totalEarnings}</p>
          </div>
          <div className="summary-card monthly">
            <h3>Monthly Earnings</h3>
            <p className="amount">PKR {earnings.monthlyEarnings}</p>
          </div>
          <div className="summary-card weekly">
            <h3>Weekly Earnings</h3>
            <p className="amount">PKR {earnings.weeklyEarnings}</p>
          </div>
        </div>

        <div className="earnings-details">
          <h2>Booking History</h2>
          <div className="bookings-list">
            {earnings.bookings.length > 0 ? (
              earnings.bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.learnerName}</h3>
                    <span className="date">{formatDate(booking.date)}</span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Time:</strong> {booking.time}</p>
                    <p><strong>Duration:</strong> {booking.duration} hours</p>
                    <p><strong>Location:</strong> {booking.location}</p>
                    <p><strong>Amount:</strong> PKR {booking.totalAmount}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-bookings">
                <p>No bookings found for the selected time period</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings; 