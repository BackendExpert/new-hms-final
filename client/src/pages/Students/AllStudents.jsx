import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import DefaultInput from '../../components/Form/DefaultInput'
import { FaFemale, FaMale } from 'react-icons/fa'


const AllStudents = () => {
    const [allstds, setAllStds] = useState([])
    const [filteredStds, setFilteredStds] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const recordsPerPage = 15
    const token = secureLocalStorage.getItem('login')

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/student/get-all-students-auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setAllStds(res.data.Result)
                setFilteredStds(res.data.Result)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const term = searchTerm.toLowerCase()
        const filtered = allstds.filter(student =>
            student.nic.toLowerCase().includes(term) ||
            student.enrolmentNo.toLowerCase().includes(term) ||
            student.indexNo.toLowerCase().includes(term)
        )
        setFilteredStds(filtered)
        setCurrentPage(1)
    }, [searchTerm, allstds])

    const totalPages = Math.ceil(filteredStds.length / recordsPerPage)
    const paginatedData = filteredStds.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)

    return (
        <div className="mt-8">
            <div className="mb-4">
                <DefaultInput
                    label="Search by NIC, Enrolment No, or Index No"
                    name="search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Enter search term..."
                />
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
                            <th className="px-6 py-4 font-semibold">Home Town</th>
                            <th className="px-6 py-4 font-semibold">Distance</th>
                            <th className="px-6 py-4 font-semibold">Hostel Assigned</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {
                            paginatedData.length > 0 ? (
                                paginatedData.map((data, index) => (
                                    <tr key={index} className="hover:bg-emerald-50 transition-all duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-800">{(currentPage - 1) * recordsPerPage + index + 1}</td>
                                        <td className="px-6 py-4">{data.enrolmentNo}</td>
                                        <td className="px-6 py-4">{data.indexNo}</td>
                                        <td className="px-6 py-4">{data.nic}</td>
                                        <td className="px-6 py-4">
                                            {
                                                data.sex === 'Male' ?
                                                    <div className="">
                                                        <span
                                                            className="flex uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                        >
                                                            <FaMale className='h-4 w-auto'/>
                                                            Male
                                                        </span>
                                                    </div>
                                                    :
                                                    <div className="">
                                                        <span
                                                            className="flex uppercase bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                        >
                                                            <FaFemale className='h-4 w-auto'/>
                                                            Female
                                                        </span>
                                                    </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">{data.address3}</td>
                                        <td className="px-6 py-4">{data.distance} Km</td>
                                        <td className="px-6 py-4">
                                            {
                                                data.isAssign === true ?
                                                    <div className="">
                                                        <span
                                                            className="uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                        >
                                                            Assigned
                                                        </span>
                                                    </div>
                                                    :
                                                    <div className="">
                                                        <span
                                                            className="uppercase bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                        >
                                                            Not-Assigned
                                                        </span>
                                                    </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/Dashboard/View-Student/${data._id}`} className="text-emerald-600 font-medium hover:underline">View</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No matching records found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {
                totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 text-sm text-gray-700">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default AllStudents
