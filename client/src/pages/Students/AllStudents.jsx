import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'

const AllStudents = () => {
    const [allstds, setallstds] = useState([])
    const token = secureLocalStorage.getItem('login')

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/student/get-all-students-auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => setallstds(res.data.Result))
            .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <div className="mt-8">
                <div className="overflow-x-auto rounded-2xl shadow-lg">
                    <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                        <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">#</th>
                                <th scope='col' className="px-6 py-4 font-semibold tracking-wider">Enrolment No</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Index No</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">NIC</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Home Town</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Distance</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {
                                allstds.map((data, index) => {
                                    return (
                                        <tr className="hover:bg-emerald-50 transition-all duration-150" key={index}>
                                            <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                                            <td className='px-6 py-4'>{data.enrolmentNo}</td>
                                            <td className='px-6 py-4'>{data.indexNo}</td>
                                            <td className='px-6 py-4'>{data.nic}</td>
                                            <td className='px-6 py-4'>{data.email}</td>
                                            <td className='px-6 py-4'>{data.address3}</td>
                                            <td className='px-6 py-4'>{data.distance} Km</td>
                                            <td className="px-6 py-4">
                                                <Link to={``} className="text-emerald-600 font-medium hover:underline">
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

export default AllStudents