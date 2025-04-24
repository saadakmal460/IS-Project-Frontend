import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/User/Register'
import Login from './components/User/Login'
import OTPVerification from './components/User/OTPScreen'
import Summary from './components/Summary/Summary'
import SecureSummary from './components/Summary/SecureSummary'
import Captcha from './components/Captcha/Captacha'
import LogsTable from './Admin/LogsTable'


function App() {
 
  return (
    <BrowserRouter>
    <Routes>
       <Route element={<h1>Home</h1>} path='/' />
        <Route element={<Login />} path='/login' />
       <Route element={<Register />} path='/register' />
       <Route element={<OTPVerification />} path='/verify' />

       <Route element={<SecureSummary />} path='/summarize' />

       <Route element={<LogsTable />} path='/admin/logs' />


       <Route element={<Captcha />} path='/cap' />



    </Routes>
    </BrowserRouter>
  )
}

export default App
