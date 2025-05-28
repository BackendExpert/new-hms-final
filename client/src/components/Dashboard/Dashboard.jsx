import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import DashSide from './DashSide'
import DashNav from './DashNav'
import DashFooter from './DashFooter'
import { FaArrowCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { MdOutlineClose } from "react-icons/md";
import '../../App.css'


const Dashbaord = () => {
    const navigate = useNavigate()
    const RoleUser = secureLocalStorage.getItem('loginR')
    const EmailUser = secureLocalStorage.getItem('loginE')
    const Username = secureLocalStorage.getItem('loginU')

    const [openside, setopenside] = useState(false);

    const headlemenuopen = () => {
        setopenside(!openside)
    }


    if (RoleUser !== "" || EmailUser !== "" || Username !== "") {
        return (
            <div className='w-full bg-gray-200 min-h-screen'>
                <div className="xl:flex">
                    <div
                        className={`shadow-[5px_0_15px_-5px_rgba(0,0,0,0.1)] p-0 xl:block fixed top-0 left-0 h-full bg-white shadow-custom z-50 xl:w-[19%] w-[75%] overflow-y-auto transform duration-500 scrollbar-thin ${openside ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
                            }`}
                    >
                        <DashSide />
                    </div>

                    <button
                        className="xl:hidden fixed top-6 left-1 z-50 bg-orange-500 p-1 rounded font-semibold"
                        onClick={headlemenuopen}
                    >
                        {openside ? (
                            <MdOutlineClose className="fill-white h-4 w-auto" />
                        ) : (
                            <TiThMenu className="fill-white h-4 w-auto" />
                        )}
                    </button>

                    <div className="xl:ml-[19%] w-full">
                        <div className="xl:-ml-4 ">
                            <DashNav />
                        </div>
                        <div className="xl:ml-4 ml-6 py-4 mr-4">
                            <Outlet />
                        </div>
                        <div className="xl:ml-0">
                            <DashFooter />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        useEffect(() => {
            localStorage.clear()
            navigate('/')
        }, [])
    }
}

export default Dashbaord