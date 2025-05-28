import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import './App.css'
// import Nav from './components/Nav/Nav'
import Register from './components/Register/Register.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Register/>
     {/* < Nav/> */}
    </>
  )
}

export default App
