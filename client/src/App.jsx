import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import './App.css'
// import Nav from './components/Nav/Nav'
import Register from './components/Register/Register.jsx'
import Login from './components/Login/Login.jsx'
import Home from './components/Home/Home.jsx'
import ScheduleTable from './components/Schedule/ScheduleTable.jsx'
import AddCourseForm from './components/admin/AddCourseForm.jsx'

import UserProfile from './components/UserProfile/UserProfile.jsx'
import { useContext } from 'react';
import AuthProvider, { AuthContext } from './components/AuthContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import Posts from './components/Posts/Posts.jsx'
import Nav from './components/Nav/Nav.jsx';
import Footer from './components/Footer/Footer.jsx';


function App() {
  // Helper to wrap routes that need Nav and Footer
  const WithLayout = ({ children }) => (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/user/:id/home"
          element={
            <PrivateRoute>
              <WithLayout>
                <Home />
              </WithLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <WithLayout>
                <ScheduleTable />
              </WithLayout>
            </PrivateRoute>

          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <WithLayout>
                <Home />
              </WithLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <PrivateRoute>
              <WithLayout>
                <Posts />
              </WithLayout>
            </PrivateRoute>

          }
        />
        <Route
          path="/AddCourse"
          element={
            <PrivateRoute>
              <WithLayout>
                <AddCourseForm />
              </WithLayout>
            </PrivateRoute>

          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <WithLayout>
                <UserProfile />
              </WithLayout>
            </PrivateRoute>

          }
        />
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children, requiredRole, condition }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  // בדיקת תפקיד
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  // בדיקת תנאי כללי נוסף (אם תרצה)
  if (condition && !condition(user)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default App
