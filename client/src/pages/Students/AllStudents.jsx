import axios from 'axios'
import React, { useEffect, useState } from 'react'
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
                                <th scope='col' className="px-6 py-4 font-semibold tracking-wider">Username</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Roles</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email Verify</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Account Status</th>
                                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AllStudents