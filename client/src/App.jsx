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
import { useContext } from 'react';
import AuthProvider, { AuthContext } from './components/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Posts from './components/Posts/Posts.jsx'



function App() {

  return (
    <>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
                    <Route path="/register" element={<Register />} />
          <Route path="/user/:id/home" element={<Home />} />
          <Route path="/schedule" element={<ScheduleTable />} />
          <Route path="/about" element={<Home />} />
          <Route path="/posts" element={<Posts />} />

          {/* <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </AuthProvider>

      {/* < Nav/> */}
    </>

  )
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
