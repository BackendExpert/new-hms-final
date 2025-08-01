import React, { useEffect, useState } from 'react'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import { Link } from 'react-router-dom'
import { FaUserLock } from "react-icons/fa";
import axios from 'axios';
;

const RolePermissions = () => {

    const [getreols, setgetroles] = useState([])
    const token = localStorage.getItem('login')
    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/auth/view-all-role', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => setgetroles(res.data.Result))
            .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Role and Permissions</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                <div className="relative bg-emerald-600 text-white p-6 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    {/* Icon in background */}
                    <div className="absolute right-4 top-4 opacity-20 text-white text-6xl">
                        <FaUserLock />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="text-sm font-medium uppercase tracking-wide text-emerald-100">
                            Roles (User Types)
                        </div>
                        <div className="mt-2 text-3xl font-bold">{getreols.length}</div>
                    </div>
                </div>
            </div>

            <Link to={'/Dashboard/Create-Permissions'}>
                <DefaultBtn
                    type='button'
                    label='Create Role and Permissions'
                />
            </Link>


            <div className="mt-8">
                <div className="overflow-x-auto rounded-2xl shadow-lg">
                    <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                        <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">#</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {
                                getreols.map((role, index) => {
                                    return (
                                        <tr className="hover:bg-emerald-50 transition-all duration-150" key={index}>
                                            <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                                            <td className="px-6 py-4">{role.name}</td>
                                            <td className="px-6 py-4">
                                                <Link to={`/Dashboard/View-One-Role/${role._id}`} className="text-emerald-600 font-medium hover:underline">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </div>



        </div>
    )
}

export default RolePermissions