import React from 'react'

const AllHostelData = () => {
    return (
        <div>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Hostel Name</th>
                            <th className="px-6 py-4 font-semibold">Location</th>
                            <th className="px-6 py-4 font-semibold">Warden</th>
                            <th className="px-6 py-4 font-semibold">Rooms</th>
                            <th className="px-6 py-4 font-semibold">Gender</th>
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

export default AllHostelData