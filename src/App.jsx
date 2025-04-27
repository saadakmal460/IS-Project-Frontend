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
import Home from './components/Home/Home'
import GoogleSuccess from './components/Google/GoogleSucess'
import ProtectedRoute from './ProtectedRoute'
import NotFound from './components/NotFound/NotFound'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // import styles

function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<Login />} path='/login' />
          <Route element={<Register />} path='/register' />
          <Route element={<OTPVerification />} path='/verify' />


          <Route element={
            <ProtectedRoute>
              <SecureSummary />
            </ProtectedRoute>
          } path='/summarize' />

          <Route element={
            <ProtectedRoute requiredRole='admin'>
              <LogsTable />
            </ProtectedRoute>
          } path='/admin/logs' />


          <Route element={<GoogleSuccess />} path='/success' />

          <Route element={<NotFound />} path='/not-found' />


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
