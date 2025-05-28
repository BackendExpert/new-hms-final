import React, { useEffect, useRef, useState } from 'react';
import { FaUserCog } from 'react-icons/fa';
import { FaGear, FaPowerOff } from 'react-icons/fa6';
import secureLocalStorage from 'react-secure-storage';

const DashNav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const username = secureLocalStorage.getItem('loginU') || 'User';
    const role = secureLocalStorage.getItem('loginR') || 'Role';

    const toggleMenu = () => setMenuOpen((open) => !open);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    // Close dropdown on outside click or ESC
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <nav className="relative bg-white border-b border-gray-200 shadow-sm py-4 px-6 rounded-b-2xl flex justify-between items-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-emerald-600 select-none">Dashboard</h1>

            <div className="relative">
                <button
                    onClick={toggleMenu}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-label="User menu"
                    className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
                >
                    <img
                        src="https://avatars.githubusercontent.com/u/138636749?s=48&v=4"
                        alt={`${username} avatar`}
                        className="h-11 w-11 rounded-full border-2 border-emerald-400 shadow-sm"
                    />
                    <span className="hidden sm:inline uppercase font-semibold text-slate-900 tracking-wider select-none">
                        {username}
                    </span>
                    <span className="absolute bottom-1 right-0 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
                </button>

                {/* Dropdown menu */}
                <div
                    ref={menuRef}
                    className={`origin-top-right absolute right-0 mt-3 w-72 rounded-3xl bg-white border border-gray-100 shadow-xl
            transition-transform transform
            ${menuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
          `}
                    role="menu"
                    aria-label="User menu options"
                >
                    <div className="p-5 border-b border-gray-100 text-center">
                        <img
                            src="https://avatars.githubusercontent.com/u/138636749?s=48&v=4"
                            alt={`${username} profile`}
                            className="h-20 w-20 mx-auto rounded-full border shadow-md"
                        />
                        <h2 className="pt-3 text-lg font-bold text-slate-900">{username}</h2>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{role}</p>
                    </div>

                    <div className="p-3 space-y-1">
                        <a
                            href="/Dashboard/Profile"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-amber-700 hover:bg-amber-100 transition font-medium"
                            role="menuitem"
                        >
                            <FaUserCog className="text-lg" />
                            Profile
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-amber-700 hover:bg-amber-100 transition font-medium"
                            role="menuitem"
                        >
                            <FaGear className="text-lg" />
                            Settings
                        </a>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
                            role="menuitem"
                        >
                            <FaPowerOff className="text-lg fill-red-600" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashNav;
