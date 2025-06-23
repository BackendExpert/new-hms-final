import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import localStorage from 'react-secure-storage';

const AllHostelData = () => {
    const [allhostels, setAllHostels] = useState([]);
    const token = localStorage.getItem('login');

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/hostel/get-all-hostels', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                setAllHostels(res.data.Result);
            })
            .catch(err => console.error("Failed to fetch hostels:", err));
    }, []);

    return (
        <div>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Hostel ID</th>
                            <th className="px-6 py-4 font-semibold">Name</th>
                            <th className="px-6 py-4 font-semibold">Location</th>
                            <th className="px-6 py-4 font-semibold">Warden</th>
                            <th className="px-6 py-4 font-semibold">Rooms</th>
                            <th className="px-6 py-4 font-semibold">Gender</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {
                            allhostels.length > 0 ? (
                                allhostels.map((data, index) => (
                                    <tr key={index} className="hover:bg-emerald-50 transition-all duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                                        <td className="px-6 py-4">{data.hostelID}</td>
                                        <td className="px-6 py-4">{data.name}</td>
                                        <td className="px-6 py-4">
                                            <td className="px-6 py-4">
                                                <a href={`${data.location}`} target='_blank' className='text-emerald-600 font-medium hover:underline'>
                                                    View
                                                </a>
                                            </td>
                                        </td>
                                        <td className="px-6 py-4">
                                            {data.warden?.username || 'Not Assigned'}
                                        </td>
                                        <td className="px-6 py-4">{data.roomCount}</td>
                                        <td className="px-6 py-4">
                                            {data.gender === 'Male' ? (
                                                <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <FaMale /> Male
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <FaFemale /> Female
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/Dashboard/View-Hostel/${data._id}`}
                                                className="text-emerald-600 font-medium hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                        No matching records found.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllHostelData;
