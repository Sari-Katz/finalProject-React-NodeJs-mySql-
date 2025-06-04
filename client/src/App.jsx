import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import './App.css'
// import Nav from './components/Nav/Nav'
import Register from './components/Register/Register.jsx'
import Login from './components/Login/Login.jsx'
import { useContext } from 'react';
import AuthProvider, { AuthContext } from './components/AuthContext';
import { Route, Routes } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </AuthProvider>

      {/* < Nav/> */}
    </>
  )
}

export default App
