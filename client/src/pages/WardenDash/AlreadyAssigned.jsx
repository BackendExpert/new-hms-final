import React, { useEffect, useState } from 'react'
import { getUserInfoFromToken } from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import { FaGraduationCap } from 'react-icons/fa6';
import axios from 'axios'

const AlreadyAssigned = () => {
    const navigate = useNavigate()
    const { username, roles } = getUserInfoFromToken() || {};
    const token = localStorage.getItem('login');

    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    if (!(roleNames.includes('admin') || roleNames.includes('director') || roleNames.includes('warden'))) {
        useEffect(() => {
            localStorage.clear()
            navigate('/', { replace: true })
        }, [])
    }

    const [assignedstd, setassignedstd] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_API}/warden/assigned-students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => setassignedstd(res.data.Result))
            .catch(err => console.log(err));
    }, []);

    const filteredData = assignedstd.filter(item => {
        const value = searchTerm.toLowerCase();
        return (
            item?.regNo?.email?.toLowerCase().includes(value) ||
            item?.regNo?.enrolmentNo?.toLowerCase().includes(value) ||
            item?.regNo?.indexNo?.toLowerCase().includes(value) ||
            item?.regNo?.nic?.toLowerCase().includes(value) ||
            item?.roomId?.roomID?.toLowerCase().includes(value)
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="-mt-4 mb-2">
                <Link to={'/Dashboard/WardenStudents'}>
                    <DefaultBtn type='button' label='Back' />
                </Link>
            </div>

            <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                    <div className="relative bg-emerald-600 text-white p-6 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute right-4 top-4 opacity-20 text-white text-6xl">
                            <FaGraduationCap />
                        </div>

                        <div className="relative z-10">
                            <div className="text-sm font-medium uppercase tracking-wide text-emerald-100">
                                Total Assgined Students
                            </div>
                            <div className="mt-2 text-3xl font-bold">{assignedstd.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Email, Enrolment No, Index No, NIC, Room ID"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Enrolment No</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Index No</th>
                            <th className="px-6 py-4 font-semibold">NIC</th>
                            <th className="px-6 py-4 font-semibold">Gender</th>
                            <th className="px-6 py-4 font-semibold">Room Number</th>
                            <th className="px-6 py-4 font-semibold">Intake Year</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentData.map((item, index) => (
                            <tr key={item._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{startIndex + index + 1}</td>
                                <td className="px-6 py-4">{item?.regNo?.enrolmentNo || 'N/A'}</td>
                                <td className="px-6 py-4">{item?.regNo?.email || 'N/A'}</td>
                                <td className="px-6 py-4">{item?.regNo?.indexNo || 'N/A'}</td>
                                <td className="px-6 py-4">{item?.regNo?.nic || 'N/A'}</td>
                                <td className="px-6 py-4">{item?.regNo?.sex || 'N/A'}</td>
                                <td className="px-6 py-4">{item?.roomId?.roomID || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    {item?.regNo?.dateOfEnrolment ? new Date(item.regNo.dateOfEnrolment).getFullYear() : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    {/* Optional Action */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AlreadyAssigned
