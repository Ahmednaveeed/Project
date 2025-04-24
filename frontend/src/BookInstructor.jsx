import { useState, useEffect } from 'react';
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
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const instructorData = JSON.parse(localStorage.getItem('instructorData')) || {};
      
      const allInstructors = users
        .filter(user => user.role === 'instructor')
        .map(user => ({
          ...user,
          ...(instructorData[user.email] || {}),
          id: user.email,
          vehicle: instructorData[user.email]?.vehicle || { vehicleType: '', makeModel: '' },
          availabilitySchedule: instructorData[user.email]?.availabilitySchedule || []
        }));
      
      setInstructors(allInstructors);
    };

    loadInstructors();
  }, []);

  const filteredInstructors = instructors.filter(instructor => {
    return (
      (filters.vehicleType === '' || instructor.vehicle.vehicleType === filters.vehicleType) &&
      (filters.availableDate === '' || instructor.availabilitySchedule.some(s => s.date === filters.availableDate)) &&
      (filters.experience === '' || instructor.experience === filters.experience) &&
      (instructor.hourlyRate >= filters.priceRange[0] && instructor.hourlyRate <= filters.priceRange[1])
    );
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

  return (
    <div className="book-instructor-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Road Master</h2>
        <ul>
          <li onClick={() => navigate('/LearnerProfile')}>My Profile</li>
          <li onClick={() => navigate('/bookings')}>My Bookings</li>
          <li className="active">Find Instructor</li>
          <li onClick={() => navigate('/learning-material')}>Learning Materials</li>
          <li onClick={() => navigate('/quiz')}>Take Quiz</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Find Driving Instructor</h1>
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
                    <p><i className="fas fa-car"></i> {instructor.vehicle.makeModel} ({instructor.vehicle.vehicleType})</p>
                    <p><i className="fas fa-money-bill-wave"></i> PKR {instructor.hourlyRate}/hr</p>
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
                    onClick={() => navigate('/create-booking', { state: { instructor } })}
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