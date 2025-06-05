import React from 'react';
import { getUserInfoFromToken } from '../../utils/auth'; // Adjust path accordingly


const DashHome = () => {
    const userInfo = getUserInfoFromToken();

    if (!userInfo) {
        return (
            <div className="bg-gray-100 p-4">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-xl font-semibold text-red-500">User not logged in</h1>
                    <p>Please log in to access the dashboard.</p>
                </div>
            </div>
        );
    }

    // Handle roles as either [{ name: 'admin' }] or ['admin']
    const roleRaw = userInfo.roles[0];
    const role = typeof roleRaw === 'string' ? roleRaw.toLowerCase() : roleRaw?.name?.toLowerCase();

    let dashboardText = 'Dashboard';

    if (role === 'admin') {
        dashboardText = 'Admin Dashboard';
    } else if (role === 'director') {
        dashboardText = 'Director Dashboard';
    } else if (role === 'warden') {
        dashboardText = 'Warden Dashboard';
    }

    return (
        <div className="p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">{dashboardText}</h1>
                <p className="text-gray-700">
                    Welcome {userInfo.username}! This is your {dashboardText.toLowerCase()} for the hostel management system.
                </p>
            </div>
        </div>
    );
};


export default DashHome;
