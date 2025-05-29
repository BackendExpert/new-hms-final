import React from 'react'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import { Link } from 'react-router-dom'

const RolePermissions = () => {
    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Role and Permissions</h1>

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
                            <tr className="hover:bg-emerald-50 transition-all duration-150">
                                <td className="px-6 py-4 font-medium text-gray-800">1</td>
                                <td className="px-6 py-4">Admin</td>
                                <td className="px-6 py-4">
                                    <Link to="#" className="text-emerald-600 font-medium hover:underline">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>



        </div>
    )
}

export default RolePermissions