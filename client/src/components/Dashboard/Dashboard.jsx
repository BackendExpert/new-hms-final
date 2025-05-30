import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUserInfoFromToken } from '../../utils/auth';
import DashSide from './DashSide';
import DashNav from './DashNav';
import DashFooter from './DashFooter';
import secureLocalStorage from 'react-secure-storage';


const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sideOpen, setSideOpen] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (!userInfo) {
            localStorage.clear();
            navigate('/');
        } else {
            setUser(userInfo);
        }
    }, [navigate]);

    const aToken = secureLocalStorage.getItem('login')

    const toggleSide = () => setSideOpen(prev => !prev);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading...
            </div>
        );
    }

    const { roles, username, email } = user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
            <div className="xl:flex">
                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 w-3/4 max-w-xs
                    transform transition-transform duration-300 ease-in-out
                    xl:translate-x-0
                    ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <DashSide />
                </aside>

                {/* Sidebar Toggle Button */}
                <button
                    aria-label={sideOpen ? 'Close menu' : 'Open menu'}
                    className="fixed top-6 left-3 z-60 p-2 rounded-md bg-emerald-600 text-white xl:hidden shadow-lg hover:bg-emerald-700 transition"
                    onClick={toggleSide}
                >
                    {sideOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Main Content */}
                <main className="flex-1 xl:ml-[19%] min-h-screen flex flex-col">
                    {/* Header */}
                    <header className="shadow-md bg-white sticky top-0 z-40">
                        <DashNav />
                    </header>

                    {/* Optional: Show role/username */}
                    <div className="p-4 text-sm text-gray-200 bg-white border-b">
                        <code className="text-emerald-600">{currentPath}</code>                        
                    </div>
                    {/* Page Content */}
                    <section className="flex-grow p-6 bg-gray-50 overflow-auto">
                        <Outlet />
                    </section>

                    {/* Footer */}
                    <footer className="bg-white border-t border-gray-200">
                        <DashFooter />
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
