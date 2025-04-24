import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddVehicle.css';

const AddVehicle = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [vehicleData, setVehicleData] = useState({
    vehicleType: 'hatchback',
    makeModel: '',
    year: currentYear,  // Default to current year
    transmission: 'automatic'
  });

  const vehicleTypes = ['Hatchback', 'Sedan', 'SUV', 'MPV'];
  const transmissionTypes = ['Automatic', 'Manual'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save vehicle data
    const instructorData = JSON.parse(localStorage.getItem('instructorData')) || {};
    localStorage.setItem('instructorData', JSON.stringify({
      ...instructorData,
      vehicle: vehicleData
    }));
    navigate('/InstructorProfile');
  };

  return (
    <div className="add-vehicle-container">
      <h1>Add Vehicle</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Vehicle Type</label>
          <select 
            name="vehicleType" 
            value={vehicleData.vehicleType}
            onChange={handleChange}
          >
            {vehicleTypes.map(type => (
              <option key={type.toLowerCase()} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Make & Model</label>
          <input
            type="text"
            name="makeModel"
            value={vehicleData.makeModel}
            onChange={handleChange}
            placeholder="e.g., Toyota Fortuner"
            required
          />
        </div>

        <div className="form-field">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={vehicleData.year}
            onChange={handleChange}
            min="1990"
            max={currentYear + 1}
            placeholder="e.g., 2005"
            required
          />
        </div>

        <div className="form-field">
          <label>Transmission</label>
          <select
            name="transmission"
            value={vehicleData.transmission}
            onChange={handleChange}
          >
            {transmissionTypes.map(type => (
              <option key={type.toLowerCase()} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/InstructorProfile')}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Save Vehicle
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;