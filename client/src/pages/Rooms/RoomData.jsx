import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaBed } from 'react-icons/fa6'
import localStorage from 'react-secure-storage'

const RoomData = () => {
    const token = localStorage.getItem('login')
    const [roomdata, setroomdata] = useState([])
    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/room/get-all-rooms', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setroomdata(res.data.Result)
                setFilteredData(res.data.Result)
            })
            .catch(err => console.log(err))
    }, [])
    const stddata = [
        {
            id: 1,
            name: 'Total Rooms',
            icon: FaBed,
            value: roomdata.length,
            bgColor: 'bg-emerald-600',
        },
    ]
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                {
                    stddata.map((data, index) => {
                        return (
                            <div key={index} className={`relative ${data.bgColor} text-white p-6 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300`}>
                                {/* Icon in background */}
                                <div className="absolute right-4 top-4 opacity-20 text-white text-6xl">
                                    <data.icon />
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="text-sm font-medium uppercase tracking-wide text-emerald-100">
                                        {data.name}
                                    </div>
                                    <div className="mt-2 text-3xl font-bold">{data.value}</div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default RoomData