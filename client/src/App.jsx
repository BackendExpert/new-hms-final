import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TestPage from './pages/HomePage/TestPage'
import SignIn from './pages/AuthPage/SignIn'
import SignUp from './pages/AuthPage/SignUp'
import ForgetPass from './pages/AuthPage/ForgetPass'
import VerifyOTP from './pages/AuthPage/VerifyOTP'
import UpdateNewPass from './pages/AuthPage/UpdateNewPass'
import VerifyEmail from './pages/AuthPage/VerifyEmail'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/Text' element={<TestPage />} />
                    <Route path='/' element={<SignIn />} />
                    <Route path='/register' element={<SignUp />} />
                    <Route path='/Forgetpassword' element={<ForgetPass /> } />
                    <Route path='/verify-otp' element={<VerifyOTP /> } />
                    <Route path='/update-new-pass' element={<UpdateNewPass /> } />
                    <Route path='/verify-email' element={<VerifyEmail /> } />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
