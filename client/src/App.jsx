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
import PrivateRoute from './components/Auth/PrivateRoute'
import Dashbaord from './components/Dashboard/Dashboard'
import DashHome from './pages/DashHome/DashHome'
import DashError from './components/Errors/DashError'
import RolePermissions from './pages/Permissions/RolePermissions'
import CreateRolePermissions from './pages/Permissions/CreateRolePermissions'
import ViewOneRole from './pages/Permissions/ViewOneRole'
import UserManage from './pages/Users/UserManage'
import ViewUser from './pages/Users/ViewUser'
import Profile from './pages/Profile/Profile'
import Students from './pages/Students/Students'
import StdCreateManually from './pages/Students/StdCreateManually'
import StdCreateSheet from './pages/Students/StdCreateSheet'
import ViewStudent from './pages/Students/ViewStudent'
import Hostels from './pages/Hostels/Hostels'
import CreateHostel from './pages/Hostels/CreateHostel'
import ViewHostel from './pages/Hostels/ViewHostel'
import Rooms from './pages/Rooms/Rooms'
import ViewRoom from './pages/Rooms/ViewRoom'
import HostelAssign from './pages/Students/HostelAssign'
import WardenStudents from './pages/WardenDash/WardenStudents'
import ExtraNeeds from './pages/StudentDash/ExtraNeeds'
import EmergencyContact from './pages/StudentDash/EmergencyContact'
import CreateExtraNeeds from './pages/StudentDash/CreateExtraNeeds'
import WardenRooms from './pages/WardenDash/WardenRooms'
import WardenRoomAssignNeed from './pages/WardenDash/WardenRoomAssignNeed'
import StdAssignNormal from './pages/WardenDash/StdAssignNormal'

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/Text' element={<TestPage />} />
                    <Route path='/' element={<SignIn />} />
                    <Route path='/register' element={<SignUp />} />
                    <Route path='/Forgetpassword' element={<ForgetPass />} />
                    <Route path='/verify-otp' element={<VerifyOTP />} />
                    <Route path='/update-new-pass' element={<UpdateNewPass />} />
                    <Route path='/verify-email' element={<VerifyEmail />} />

                    <Route path='/Dashboard/' element={<PrivateRoute element={<Dashbaord />} />} >
                        <Route path='*' element={<DashError /> } />
                        <Route path='Home' element={<PrivateRoute element={<DashHome />} />} />
                        
                        <Route path='Permissions' element={<PrivateRoute element={<RolePermissions /> } /> } />
                        <Route path='Create-Permissions' element={<PrivateRoute element={<CreateRolePermissions /> } /> } />
                        <Route path='View-One-Role/:id' element={<PrivateRoute element={<ViewOneRole /> } />} />
                    
                        <Route path='Users' element={<PrivateRoute element={<UserManage /> } /> } />
                        <Route path='View-user/:id' element={<PrivateRoute element={<ViewUser /> } /> } />

                        <Route path='Profile' element={<PrivateRoute element={<Profile /> } /> } />

                        <Route path='Students' element={<PrivateRoute element={<Students /> } /> } />
                        <Route path='Student-create-manually' element={<PrivateRoute element={<StdCreateManually /> } /> } />
                        <Route path='Stundet-upload-sheet' element={<PrivateRoute element={<StdCreateSheet /> } /> } />
                        <Route path='View-Student/:id' element={<PrivateRoute element={<ViewStudent /> } /> } />

                        <Route path='Student-assign' element={<PrivateRoute element={<HostelAssign /> } /> } />


                        <Route path='Hostels' element={<PrivateRoute element={<Hostels /> } /> } />
                        <Route path='Create-hostel' element={<PrivateRoute element={<CreateHostel /> } /> } />
                        <Route path='View-Hostel/:id' element={<PrivateRoute element={<ViewHostel /> } /> } />

                        <Route path='Rooms' element={<PrivateRoute element={<Rooms /> } /> } />
                        <Route path='View-Room/:id' element={<PrivateRoute element={<ViewRoom /> } /> } />

                        <Route path='WardenStudents' element={<PrivateRoute element={<WardenStudents /> } /> } />
                        <Route path='WardenRooms' element={<PrivateRoute element={<WardenRooms /> } /> } />
                        <Route path='WardenRoomAssignNeed' element={<PrivateRoute element={<WardenRoomAssignNeed /> } /> } />
                        <Route path='StudentdAssignNormal' element={<PrivateRoute element={<StdAssignNormal /> } /> } /> 
        

                        <Route path='ExtraNeeds' element={<PrivateRoute element={<ExtraNeeds /> } /> } />
                        <Route path='CreateExtraNeeds' element={<PrivateRoute element={<CreateExtraNeeds /> } /> } />
                        <Route path='EmergencyContact' element={<PrivateRoute element={<EmergencyContact /> } /> } />

                    </Route>

                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
