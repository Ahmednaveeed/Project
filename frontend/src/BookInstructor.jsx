import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookInstructor.css';

const BookInstructor = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [filters, setFilters] = useState({
    vehicleType: '',
    availableDate: '',
    experience: '',
    priceRange: [0, 5000]
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadInstructors = () => {
      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const instructorData = JSON.parse(localStorage.getItem('instructorData')) || {};
      
      console.log('Users from localStorage:', users);
      console.log('Instructor data from localStorage:', instructorData);
      
      // Filter users who are instructors and map their data
      const allInstructors = users
        .filter(user => user.role === 'instructor')
        .map(user => {
          // Get instructor-specific data
          const instructorInfo = instructorData[user.email] || {};
          console.log(`Instructor info for ${user.email}:`, instructorInfo);
          
          return {
            ...user,
            ...instructorInfo,
            id: user.email,
            // Make sure we're accessing the vehicle data correctly
            vehicle: instructorInfo.vehicle || { 
              vehicleType: instructorInfo.transmissionType || '', 
              makeModel: instructorInfo.carDetails || '' 
            },
            availabilitySchedule: instructorInfo.availabilitySchedule || [],
            // Make sure we're using the correct hourly rate
            hourlyRate: instructorInfo.hourlyRate || 0,
            experience: instructorInfo.experience || 'amateur'
          };
        });
      
      console.log('Processed instructors:', allInstructors);
      setInstructors(allInstructors);
    };

    loadInstructors();
  }, []);

  const filteredInstructors = instructors.filter(instructor => {
    const matchesVehicleType = !filters.vehicleType || 
      instructor.vehicle?.vehicleType === filters.vehicleType;
    
    const matchesDate = !filters.availableDate || 
      instructor.availabilitySchedule?.some(s => s.date === filters.availableDate);
    
    const matchesExperience = !filters.experience || 
      instructor.experience === filters.experience;
    
    const matchesPrice = instructor.hourlyRate >= filters.priceRange[0] && 
      instructor.hourlyRate <= filters.priceRange[1];

    return matchesVehicleType && matchesDate && matchesExperience && matchesPrice;
  });

  const availableDates = [...new Set(
    instructors.flatMap(i => i.availabilitySchedule?.map(s => s.date) || [])
  )].sort();

  const experienceOptions = [
    { value: '', label: 'All Levels' },
    { value: 'amateur', label: 'Amateur' },
    { value: 'professional', label: 'Professional' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleBookNow = (instructorId) => {
    navigate(`/BookingForm/${instructorId}`);
  };

  return (
    <div className="book-instructor-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/LearnerProfile')}>My Profile</li>
          <li onClick={() => navigate('/ViewBookings')}>View Bookings</li>
          <li onClick={() => navigate('/LearningMaterial')}>Learning Material</li>
          <li onClick={() => navigate('/Quiz')}>Take Quiz</li>
          <li className="active" onClick={() => navigate('/BookInstructor')}>Book Instructor</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Book Instructor</h1>
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Vehicle Type</label>
              <select
                name="vehicleType"
                value={filters.vehicleType}
                onChange={(e) => setFilters({...filters, vehicleType: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Available Date</label>
              <select
                value={filters.availableDate}
                onChange={(e) => setFilters({...filters, availableDate: e.target.value})}
              >
                <option value="">Any Date</option>
                {availableDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Experience Level</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
              >
                {experienceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range: PKR {filters.priceRange[0]} - {filters.priceRange[1]}</label>
              <div className="range-slider">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                  })}
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Instructors List */}
        <div className="instructors-list">
          {filteredInstructors.length > 0 ? (
            filteredInstructors.map(instructor => (
              <div key={instructor.id} className="instructor-card">
                <div className="card-header">
                  <h3>{instructor.fullName}</h3>
                  <span className={`badge ${instructor.experience}`}>
                    {experienceOptions.find(e => e.value === instructor.experience)?.label}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="details">
                    <p>
                      <i className="fas fa-car"></i> 
                      {instructor.vehicle.makeModel || instructor.carDetails || 'No car details'} 
                      ({instructor.vehicle.vehicleType || instructor.transmissionType || 'Unknown type'})
                    </p>
                    <p><i className="fas fa-money-bill-wave"></i> PKR {instructor.hourlyRate || 0}/hr</p>
                    {filters.availableDate && (
                      <div className="availability">
                        <p><i className="fas fa-calendar-day"></i> Available Slots:</p>
                        <div className="slots">
                          {instructor.availabilitySchedule
                            .find(s => s.date === filters.availableDate)
                            ?.slots.map(slot => (
                              <span key={slot}>{slot}</span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="book-btn"
                    onClick={() => handleBookNow(instructor.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No instructors found matching your criteria</p>
              <button onClick={() => setFilters({
                vehicleType: '',
                availableDate: '',
                experience: '',
                priceRange: [0, 5000]
              })}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookInstructor;