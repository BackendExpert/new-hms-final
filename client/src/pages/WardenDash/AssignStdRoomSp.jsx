import React from 'react'
import { getUserInfoFromToken } from '../../utils/auth';
import { useEffect } from 'react';
import { FaGraduationCap } from 'react-icons/fa6';

const AssignStdRoomSp = () => {
    const { username, roles } = getUserInfoFromToken() || {};

    // Normalize role names
    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    if (roleNames.includes('admin') || roleNames.includes('director') || roleNames.includes('warden')) {
        return (
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                    <div className="relative bg-emerald-600 text-white p-6 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute right-4 top-4 opacity-20 text-white text-6xl">
                            <FaGraduationCap />
                        </div>

                        <div className="relative z-10">
                            <div className="text-sm font-medium uppercase tracking-wide text-emerald-100">
                                Total Students
                            </div>
                            <div className="mt-2 text-3xl font-bold">50</div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl shadow-lg">
                    <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                        <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">#</th>
                                <th className="px-6 py-4 font-semibold">Enrolment No</th>
                                <th className="px-6 py-4 font-semibold">Index No</th>
                                <th className="px-6 py-4 font-semibold">NIC</th>
                                <th className="px-6 py-4 font-semibold">Gender</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
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
    else {
        useEffect(() => {
            localStorage.clear()
            window.location.reload()
        }, [])
    }

}

export default AssignStdRoomSp