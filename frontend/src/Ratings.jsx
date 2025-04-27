import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ratings.css';

const Ratings = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratingBreakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', '5', '4', '3', '2', '1'

  useEffect(() => {
    loadRatings();
  }, [filter]);

  const loadRatings = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Get all ratings from localStorage
    const allRatings = JSON.parse(localStorage.getItem('ratings')) || [];
    
    // Filter ratings for current instructor
    const instructorRatings = allRatings.filter(rating => 
      rating.instructorEmail === currentUser.email
    );

    // Get learner details for each rating
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const ratingsWithLearnerDetails = instructorRatings.map(rating => {
      const learner = users.find(user => user.email === rating.learnerEmail);
      return {
        ...rating,
        learnerName: learner ? learner.fullName : 'Unknown Learner',
        date: new Date(rating.date)
      };
    });

    // Calculate average rating
    const totalRatings = ratingsWithLearnerDetails.length;
    const sumRatings = ratingsWithLearnerDetails.reduce((sum, rating) => sum + rating.stars, 0);
    const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;

    // Calculate rating breakdown
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };
    
    ratingsWithLearnerDetails.forEach(rating => {
      ratingBreakdown[rating.stars]++;
    });

    // Filter reviews based on selected filter
    let filteredReviews = ratingsWithLearnerDetails;
    if (filter !== 'all') {
      filteredReviews = ratingsWithLearnerDetails.filter(rating => rating.stars === parseInt(filter));
    }

    setRatings({
      averageRating,
      totalRatings,
      ratingBreakdown,
      reviews: filteredReviews.sort((a, b) => b.date - a.date) // Sort by date, newest first
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

  const renderStars = (stars) => {
    return [...Array(5)].map((_, index) => (
      <span 
        key={index} 
        className={`star ${index < stars ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  const calculatePercentage = (count) => {
    return ratings.totalRatings > 0 
      ? Math.round((count / ratings.totalRatings) * 100) 
      : 0;
  };

  if (loading) {
    return <div className="loading">Loading ratings data...</div>;
  }

  return (
    <div className="ratings-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/InstructorProfile')}>My Profile</li>
          <li onClick={() => navigate('/ManageLessons')}>Manage Lessons</li>
          <li onClick={() => navigate('/BookingRequests')}>Booking Requests</li>
          <li className="active">Ratings</li>
          <li onClick={() => navigate('/Earnings')}>Earnings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>My Ratings</h1>
        </div>

        <div className="ratings-summary">
          <div className="average-rating">
            <div className="rating-circle">
              <span className="rating-number">{ratings.averageRating}</span>
              <span className="rating-max">/5</span>
            </div>
            <div className="rating-stars">
              {renderStars(Math.round(parseFloat(ratings.averageRating)))}
            </div>
            <p className="total-ratings">{ratings.totalRatings} {ratings.totalRatings === 1 ? 'rating' : 'ratings'}</p>
          </div>
          
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="breakdown-row">
                <div className="stars-label">
                  <span>{stars} stars</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${calculatePercentage(ratings.ratingBreakdown[stars])}%` }}
                  ></div>
                </div>
                <div className="count">
                  <span>{ratings.ratingBreakdown[stars]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ratings-filter">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map(stars => (
            <button 
              key={stars}
              className={filter === stars.toString() ? 'active' : ''} 
              onClick={() => setFilter(stars.toString())}
            >
              {stars} Stars
            </button>
          ))}
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          <div className="reviews-list">
            {ratings.reviews.length > 0 ? (
              ratings.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h3>{review.learnerName}</h3>
                      <span className="date">{formatDate(review.date)}</span>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.stars)}
                    </div>
                  </div>
                  {review.comment && (
                    <div className="review-comment">
                      <p>{review.comment}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews found for the selected filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings; 