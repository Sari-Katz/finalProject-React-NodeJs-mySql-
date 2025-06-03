import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import './App.css'
// import Nav from './components/Nav/Nav'
import Register from './components/Register/Register.jsx'
import { useContext } from 'react';
import AuthProvider, { AuthContext } from './components/AuthContext';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthProvider>
        <Register />
      </AuthProvider>

      {/* < Nav/> */}
    </>
  )
}

export default App
