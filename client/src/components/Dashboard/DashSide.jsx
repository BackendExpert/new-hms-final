import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { dashsidedata } from './DashSideData';
import uoplogo from '../../assets/uoplogo.png';

const DashSide = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const username = secureLocalStorage.getItem('loginU') || 'User';
    const role = secureLocalStorage.getItem('loginR') || 'guest';
    const location = useLocation();

    useEffect(() => {
        // Set active menu based on current pathname
        const currentItem = dashsidedata.find((item) => item.link === location.pathname);
        if (currentItem) {
            setActiveMenu(currentItem.id);
            localStorage.setItem('dashmenuID', currentItem.id);
        } else {
            const saved = localStorage.getItem('dashmenuID');
            setActiveMenu(saved ? Number(saved) : null);
        }
    }, [location]);

    // Filter menu items based on role
    const filteredMenu = dashsidedata.filter((item) => {
        if (role === 'admin' || role === 'director') return item.id !== 3;
        if (role === 'warden') return ![2, 7].includes(item.id);
        return false;
    });

    return (
        <aside className="bg-white shadow-lg border-r border-gray-200 min-h-screen p-6 flex flex-col xl:rounded-r-3xl
      overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 hover:scrollbar-thumb-emerald-500 transition-all duration-300">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
                <img src={uoplogo} alt="University of Peradeniya Logo" className="h-14 object-contain" />
            </div>

            <h2 className="text-center text-sm font-extrabold text-emerald-600 tracking-widest mb-6 select-none">
                HOSTEL MANAGEMENT SYSTEM
            </h2>

            {/* User Info */}
            <div className="flex items-center gap-4 bg-emerald-100 text-emerald-700 rounded-2xl p-4 shadow-inner mb-8 select-none">
                <img
                    src="https://avatars.githubusercontent.com/u/138636749?v=4"
                    alt={`${username} avatar`}
                    className="h-12 w-12 rounded-full border-2 border-emerald-400 shadow"
                />
                <div>
                    <h3 className="font-semibold uppercase tracking-wide">{username}</h3>
                    <p className="text-xs uppercase font-medium tracking-wider">{role}</p>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col space-y-2 flex-grow">
                {filteredMenu.length === 0 && (
                    <p className="text-center text-gray-400 mt-8">No menu items available</p>
                )}

                {filteredMenu.map(({ id, name, icon: Icon, link }) => (
                    <Link to={link} key={id} onClick={() => setActiveMenu(id)}>
                        <div
                            className={`flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer select-none
              transition-colors duration-200 ease-in-out
              ${activeMenu === id
                                    ? 'bg-emerald-500 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'}`}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="font-medium">{name}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default DashSide;
