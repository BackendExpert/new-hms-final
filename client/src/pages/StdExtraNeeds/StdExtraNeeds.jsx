import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StdExtraNeeds = () => {
    const [getextraneeds, setgetextraneeds] = useState([])

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/warden/std-extra-needs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => setgetextraneeds(res.data.Result))
            .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Room No</th>
                            <th className="px-6 py-4 font-semibold">Current Occupants</th>
                            <th className="px-6 py-4 font-semibold">Capacity</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Gender</th>
                            <th className="px-6 py-4 font-semibold">Hostel</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {
                            currentItems.length > 0 ? currentItems.map((data, index) => (
                                <tr key={index} className="hover:bg-emerald-50 transition-all duration-150">
                                    <td className="px-6 py-4 font-medium text-gray-800">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-6 py-4">{data.roomID}</td>
                                    <td className="px-6 py-4">{data.currentOccupants}</td>
                                    <td className="px-6 py-4">{data.capasity}</td>
                                    <td className="px-6 py-4">
                                        {
                                            data.status === "Availabe" ? (
                                                <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <FaRegCheckSquare className="h-4 w-auto" /> Available
                                                </span>
                                            ) : data.status === "Repair" ? (
                                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <BsHouseGearFill className="h-4 w-auto" /> Repair
                                                </span>
                                            ) : data.status === "Full" ? (
                                                <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <MdOutlineDoNotDisturbAlt className="h-4 w-auto" /> Full
                                                </span>
                                            ) : null
                                        }
                                    </td>
                                    <td className="px-6 py-4">{data.gender}</td>
                                    <td className="px-6 py-4">{data?.hostelID?.name}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/Dashboard/View-Room/${data._id}`} className="text-emerald-600 font-medium hover:underline">View</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No matching records found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StdExtraNeeds