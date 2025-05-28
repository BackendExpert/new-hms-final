import React, { useEffect, useRef, useState } from 'react'
import { FaUserCog } from 'react-icons/fa'
import { FaGear, FaPowerOff } from 'react-icons/fa6'
import secureLocalStorage from 'react-secure-storage'

const DashNav = () => {
    const [menu, setmenu] = useState(false)
    const menuRef = useRef()

    const username = secureLocalStorage.getItem('loginU')
    const role = secureLocalStorage.getItem('loginR')

    const toggleMenu = () => {
        setmenu(!menu)
    }

    const headleLogout = () => {
        localStorage.clear()
        window.location.reload()
    }

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setmenu(false)
            }
        }

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setmenu(false)
            }
        }

        document.addEventListener('mousedown', handler)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handler)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    return (
        <div className="relative z-50 bg-white border-b border-gray-200 shadow-sm py-4 px-6 rounded-b-2xl">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-wide text-emerald-600">Dashboard</h1>
                <div className="flex items-center gap-4 cursor-pointer" onClick={toggleMenu}>
                    <div className="relative">
                        <img
                            src="https://avatars.githubusercontent.com/u/138636749?s=48&v=4"
                            alt=""
                            className="h-10 w-10 rounded-full border-2 border-emerald-300 shadow"
                        />
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
                    </div>
                    <h1 className="text-sm uppercase text-slate-800">{username}</h1>
                </div>
            </div>
    
            <div
                ref={menuRef}
                className={`absolute right-6 top-20 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 transform
                ${menu ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="text-center p-5 border-b border-gray-100">
                    <img
                        src="https://avatars.githubusercontent.com/u/138636749?s=48&v=4"
                        alt="profile"
                        className="h-20 w-20 mx-auto rounded-full border shadow"
                    />
                    <h1 className="pt-3 text-lg font-bold text-slate-800">{username}</h1>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{role}</p>
                </div>
    
                <div className="p-2 space-y-1">
                    <a
                        href="/Dashboard/Profile"
                        className="flex items-center gap-3 text-[#4a2d11] hover:bg-[#e5bc11]/10 px-4 py-2 rounded-lg transition"
                    >
                        <FaUserCog className="text-base" />
                        <span className="text-sm font-medium">Profile</span>
                    </a>
    
                    <a
                        href="#"
                        className="flex items-center gap-3 text-[#4a2d11] hover:bg-[#e5bc11]/10 px-4 py-2 rounded-lg transition"
                    >
                        <FaGear className="text-base" />
                        <span className="text-sm font-medium">Settings</span>
                    </a>
    
                    <div
                        onClick={headleLogout}
                        className="cursor-pointer flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
                    >
                        <FaPowerOff className="text-base fill-red-500" />
                        <span className="text-sm font-medium">Logout</span>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default DashNav