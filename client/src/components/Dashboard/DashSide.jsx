import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserInfoFromToken } from '../../utils/auth';
import { dashsidedata } from './DashSideData';
import uoplogo from '../../assets/uoplogo.png';
import DashUser from '../../assets/DashUser.png';

const DashSide = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { username, roles } = getUserInfoFromToken() || {};

    // Normalize role names
    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    // Filter menu based on role
    const filteredMenu = dashsidedata.filter(item => {
        if (roleNames.includes('admin') || roleNames.includes('director')) {
            return ![3, 5, 7, 11, 12].includes(item.id); // Hide item with id 3
        }
        if (roleNames.includes('warden')) {
            return ![2, 4, 6, 9, 10, 11, 12].includes(item.id); // Hide these items for warden
        }
        if (roleNames.includes('student')) {
            return ![2, 3, 4, 5, 6, 7, 9, 10].includes(item.id); // Hide these items for warden
        }
        return false; // All others get no menu
    });

    useEffect(() => {
        const currentItem = dashsidedata.find(item => item.link === location.pathname);
        if (currentItem) {
            // Check if current item is allowed for this user role
            const allowedIds = filteredMenu.map(item => item.id);
            if (roleNames.includes('warden') && !allowedIds.includes(currentItem.id)) {
                // Warden trying to access forbidden menu -> logout
                localStorage.clear();
                navigate('/');  // Adjust your login path here
                return;
            }
            setActiveMenu(currentItem.id);
            localStorage.setItem('dashmenuID', currentItem.id);
        } else {
            const savedId = localStorage.getItem('dashmenuID');
            if (savedId) {
                const savedIdNum = Number(savedId);
                const allowedIds = filteredMenu.map(item => item.id);
                if (allowedIds.includes(savedIdNum)) {
                    setActiveMenu(savedIdNum);
                } else {
                    // Saved menu id not allowed for current user role, logout
                    localStorage.clear();
                    navigate('/');
                }
            } else {
                setActiveMenu(null);
            }
        }
    }, [location, filteredMenu, roleNames, navigate]);

    return (
        <aside
            className="bg-white shadow-lg border-r border-gray-200 min-h-screen p-6 flex flex-col xl:rounded-r-3xl
                overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 hover:scrollbar-thumb-emerald-500 transition-all duration-300"
        >
            <div className="mb-6 flex justify-center">
                <img src={uoplogo} alt="University of Peradeniya Logo" className="h-14 object-contain" />
            </div>

            <h2 className="text-center text-sm font-extrabold text-emerald-600 tracking-widest mb-6 select-none">
                HOSTEL MANAGEMENT SYSTEM
            </h2>

            <div className="flex items-center gap-4 bg-emerald-100 text-emerald-700 rounded-2xl p-4 shadow-inner mb-8 select-none">
                <img
                    src={DashUser}
                    alt={`${username} avatar`}
                    className="h-12 w-12 rounded-full border-2 border-emerald-400 shadow"
                />
                <div>
                    <h3 className="font-semibold uppercase tracking-wide">{username}</h3>
                    <p className="text-xs uppercase font-medium tracking-wider">
                        {roleNames.join(', ')}
                    </p>
                </div>
            </div>

            <nav className="flex flex-col space-y-3 flex-grow">
                {filteredMenu.map(({ id, icon: Icon, name, link }) => (
                    <Link
                        to={link}
                        key={id}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors
                            ${activeMenu === id
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : 'text-emerald-700 hover:bg-emerald-200 hover:text-emerald-600'
                            }`}
                        onClick={() => {
                            setActiveMenu(id);
                            localStorage.setItem('dashmenuID', id);
                        }}
                        tabIndex={0}
                        aria-current={activeMenu === id ? 'page' : undefined}
                    >
                        <span className="text-lg"><Icon /></span>
                        <span className="font-semibold tracking-wide">{name}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default DashSide;
