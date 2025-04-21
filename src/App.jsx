import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/User/Register'
import Login from './components/User/Login'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
       <Route element={<h1>Home</h1>} path='/' />
        <Route element={<Login />} path='/login' />
       <Route element={<Register />} path='/register' />
    </Routes>
    </BrowserRouter>
  )
}

export default App
