import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TestPage from './pages/HomePage/TestPage'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<TestPage /> } />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
