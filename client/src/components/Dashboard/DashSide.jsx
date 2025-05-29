import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserInfoFromToken } from '../../utils/auth';
import { dashsidedata } from './DashSideData';
import uoplogo from '../../assets/uoplogo.png';

const DashSide = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const location = useLocation();

    const { username, roles } = getUserInfoFromToken() || {};

    useEffect(() => {
        const currentItem = dashsidedata.find(item => item.link === location.pathname);
        if (currentItem) {
            setActiveMenu(currentItem.id);
            localStorage.setItem('dashmenuID', currentItem.id);
        } else {
            const savedId = localStorage.getItem('dashmenuID');
            setActiveMenu(savedId ? Number(savedId) : null);
        }
    }, [location]);

    // ✅ Normalize role names
    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    // ✅ Filter menu based on role
    const filteredMenu = dashsidedata.filter(item => {
        if (roleNames.includes('admin') || roleNames.includes('director')) {
            return item.id !== 3; // Hide item with id 3
        }
        if (roleNames.includes('warden')) {
            return ![2, 7].includes(item.id); // Hide items 2 and 7
        }
        return false; // All others get no menu
    });

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
                    src="https://avatars.githubusercontent.com/u/138636749?v=4"
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
