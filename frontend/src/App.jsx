import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ManageLessons from "./ManageLessons";
import BookingRequests from "./BookingRequests";
import Earnings from "./Earnings";
import Ratings from "./Ratings";
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'learner') {
        return <Navigate to="/LearnerProfile" />;
      } else if (user.role === 'instructor') {
        return <Navigate to="/InstructorProfile" />;
      } else if (user.role === 'admin') {
        return <Navigate to="/AdminProfile" />;
      }
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/LearnerProfile"
          element={
            <PrivateRoute allowedRoles={['learner']}>
              <LearnerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/InstructorProfile"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <InstructorProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminProfile"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/EditProfile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/InstructorEditProfile"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <InstructorEditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/ManageLessons"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <ManageLessons />
            </PrivateRoute>
          }
        />
        <Route
          path="/ViewBookings"
          element={
            <PrivateRoute allowedRoles={['learner', 'instructor']}>
              <ViewBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/LearningMaterial"
          element={
            <PrivateRoute allowedRoles={['learner']}>
              <LearningMaterial />
            </PrivateRoute>
          }
        />
        <Route
          path="/BookInstructor"
          element={
            <PrivateRoute allowedRoles={['learner']}>
              <BookInstructor />
            </PrivateRoute>
          }
        />
        <Route
          path="/Quiz"
          element={
            <PrivateRoute allowedRoles={['learner']}>
              <Quiz />
            </PrivateRoute>
          }
        />
        <Route
          path="/ChangePassword"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/AddVehicle"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <AddVehicle />
            </PrivateRoute>
          }
        />
        <Route
          path="/BookingRequests"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <BookingRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/Ratings"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <Ratings />
            </PrivateRoute>
          }
        />
        <Route
          path="/Earnings"
          element={
            <PrivateRoute allowedRoles={['instructor']}>
              <Earnings />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
