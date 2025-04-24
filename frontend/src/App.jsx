import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import EditProfile from "./EditProfile"; 
import LearnerProfile from "./LearnerProfile";
import InstructorProfile from "./InstructorProfile"; 
import ChangePassword from "./ChangePassword";
import InstructorEditProfile from "./InstructorEditProfile";
import AddVehicle from "./AddVehicle";
import ViewUsers from "./ViewUsers";
import AdminProfile from "./AdminProfile"; 
import Quiz from "./Quiz"; 
import BookInstructor from "./BookInstructor";
import LearningMaterial from "./LearningMaterial"; 
import ViewBookings from "./ViewBookings"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/InstructorEditProfile" element={<InstructorEditProfile />} />
        <Route path="/Learnerprofile" element={<LearnerProfile />} />
        <Route path="/InstructorProfile" element={<InstructorProfile />} />
        {/* Placeholder routes for navigation */}
        <Route path="/bookings" element={<ViewBookings />} />
        <Route path="/learning-material" element={<LearningMaterial />} />
        <Route path="/book-instructor" element={<BookInstructor />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/admin/learners" element={<ViewUsers userType="learner" />} />
        <Route path="/admin/instructors" element={<ViewUsers userType="instructor" />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/bookings" element={<div>Bookings Page</div>} />
        <Route path="/learning-material" element={<div>Learning Material Page</div>} />
        <Route path="/quiz" element={<div>Quiz Page</div>} />
        <Route path="/book-instructor" element={<div>Book Instructor Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />   
        <Route path="/manage-lessons" element={<div>Manage Lessons Page</div>} />
        <Route path="/booking-requests" element={<div>Booking Requests Page</div>} />
        <Route path="/availability" element={<div>Availability Page</div>} />
        <Route path="/ratings" element={<div>Ratings Page</div>} />
        <Route path="/earnings" element={<div>Earnings Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
