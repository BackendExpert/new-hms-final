import React from 'react'

const AllRooms = () => {
    return (
        <div>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Room No</th>
                            <th className="px-6 py-4 font-semibold">Hostel No</th>
                            <th className="px-6 py-4 font-semibold">NIC</th>
                            <th className="px-6 py-4 font-semibold">Capasity</th>
                            <th className="px-6 py-4 font-semibold">Current Occupants</th>
                            <th className="px-6 py-4 font-semibold">Distance</th>
                            <th className="px-6 py-4 font-semibold">Hostel Assigned</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllRooms