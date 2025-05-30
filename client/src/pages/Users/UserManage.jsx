import React, { useEffect, useState } from 'react'
import { FaUsers } from 'react-icons/fa6'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { Link } from 'react-router-dom'


const UserManage = () => {
    const [getusers, setgetusers] = useState([])

    const token = secureLocalStorage.getItem('login')

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/user/view-all-users', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => setgetusers(res.data.Result))
            .catch(err => console.log(err))
    }, [])



    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Manage Users</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                <div className="relative bg-emerald-600 text-white p-6 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                    {/* Icon in background */}
                    <div className="absolute right-4 top-4 opacity-20 text-white text-6xl">
                        <FaUsers />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="text-sm font-medium uppercase tracking-wide text-emerald-100">
                            Total Users
                        </div>
                        <div className="mt-2 text-3xl font-bold">{getusers.length}</div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="overflow-x-auto rounded-2xl shadow-lg">
                    <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                        <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">#</th>
                                <th scope='col' className="px-6 py-4 font-semibold tracking-wider">Username</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Roles</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email Verify</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Account Status</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {
                                getusers.map((user, index) => {
                                    return (
                                        <tr className="hover:bg-emerald-50 transition-all duration-150" key={index}>
                                            <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                                            <td className="px-6 py-4">{user.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles?.length > 0 ? (
                                                        user.roles.map((role, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                            >
                                                                {typeof role === 'string' ? role : role.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 italic text-sm">No roles</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {
                                                    user.emailVerified === true ?
                                                        <div className="">
                                                            <span
                                                                className="uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                            >
                                                                Verified
                                                            </span>
                                                        </div>
                                                        :
                                                        <div className="">
                                                            <span
                                                                className="uppercase bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                            >
                                                                Not Verified
                                                            </span>
                                                        </div>

                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                {
                                                    user.active === true ?
                                                        <div className="">
                                                            <span
                                                                className="uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                            >
                                                                Active
                                                            </span>
                                                        </div>
                                                        :
                                                        <div className="">
                                                            <span
                                                                className="uppercase bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                            >
                                                                Deactive
                                                            </span>
                                                        </div>

                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link to={`/Dashboard/View-One-Role/${user._id}`} className="text-emerald-600 font-medium hover:underline">
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

export default UserManage