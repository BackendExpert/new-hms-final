import React from 'react'
import { getUserInfoFromToken } from '../../utils/auth';
import { useEffect } from 'react';
import { FaGraduationCap } from 'react-icons/fa6';
import { useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';

const AssignStdRoomSp = () => {
    const token = localStorage.getItem('login')
    const { username, roles } = getUserInfoFromToken() || {};

    const [approvedstds, setapprovedstds] = useState([]);

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/warden/std-extra-needs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const filtered = res.data.Result.filter(item => item.isAccpeted === true);
                setapprovedstds(filtered);
            })
            .catch(err => console.log(err));
    }, []);

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
                            <div className="mt-2 text-3xl font-bold">{approvedstds.length}</div>
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
                            {approvedstds.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        No approved students found.
                                    </td>
                                </tr>
                            ) : (
                                approvedstds.map((student, index) => (
                                    <tr key={student._id || student.regNo || index}>
                                        <td className="px-6 py-3">{index + 1}</td>
                                        <td className="px-6 py-3">{student.regNo?.enrolmentNo || '-'}</td>
                                        <td className="px-6 py-3">{student.regNo?.indexNo || '-'}</td>
                                        <td className="px-6 py-3">{student.regNo?.nic || '-'}</td>
                                        <td className="px-6 py-3 capitalize">{student.regNo?.sex || '-'}</td>
                                        <td className="px-6 py-3">{student.regNo?.email || '-'}</td>
                                        <td className="px-6 py-3">
                                            {/* Customize this action button as needed */}

                                            <Link to={`/Dashboard/AssignStudentToRoom/${student.regNo?._id}`}>
                                                <button
                                                    className="cursor-pointer text-sm text-emerald-600 hover:text-emerald-800 font-semibold"
                                                >
                                                    Assign Room
                                                </button>
                                            </Link>

                                        </td>
                                    </tr>
                                ))
                            )}
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
