import React from 'react'
import { FaSchool } from 'react-icons/fa6'

const HostelData = () => {
    const hostalData = [
        {
            id: 1,
            name: 'Total Hostels',
            icon: FaSchool,
            value: 54,
            bgColor: 'bg-emerald-600',
        },
        // {
        //     id: 2,
        //     name: 'CardName',
        //     icon: FaUserGraduate,
        //     value: allstds.length,
        //     bgColor: 'bg-emerald-600',
        // },

    ]
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                {
                    hostalData.map((data, index) => {
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

export default HostelData