import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DefaultInput from '../../components/Form/DefaultInput'
import { FaRegCheckSquare } from 'react-icons/fa'
import { BsHouseGearFill } from 'react-icons/bs'
import { MdOutlineDoNotDisturbAlt } from 'react-icons/md'

const StdExtraNeeds = () => {
    const [getExtraNeeds, setGetExtraNeeds] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15

    const token = localStorage.getItem('login')

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/warden/std-extra-needs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log("API FULL RESPONSE:", res.data);
                setGetExtraNeeds(res.data.Result)
                setFilteredData(res.data.Result)
            })
            .catch(err => console.log(err))
    }, [])


    useEffect(() => {
        const filtered = getExtraNeeds.filter(item =>
            item.studentEmail?.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredData(filtered)
        setCurrentPage(1)
    }, [search, getExtraNeeds])

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-4">
                <DefaultInput
                    label="Search by Email"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type email to search..."
                />
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Student Email</th>
                            <th className="px-6 py-4 font-semibold">Needs</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentItems.length > 0 ? currentItems.map((data, index) => (
                            <tr key={index} className="hover:bg-emerald-50 transition-all duration-150">
                                <td className="px-6 py-4 font-medium text-gray-800">{indexOfFirstItem + index + 1}</td>
                                <td className="px-6 py-4">{data.studentEmail}</td>
                                <td className="px-6 py-4">{data.needs}</td>
                                <td className="px-6 py-4">
                                    {data.status === "Approved" && (
                                        <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                            <FaRegCheckSquare className="h-4 w-auto" /> Approved
                                        </span>
                                    )}
                                    {data.status === "Pending" && (
                                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                            <BsHouseGearFill className="h-4 w-auto" /> Pending
                                        </span>
                                    )}
                                    {data.status === "Rejected" && (
                                        <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                            <MdOutlineDoNotDisturbAlt className="h-4 w-auto" /> Rejected
                                        </span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No matching records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`px-3 py-1 rounded-md border text-sm font-medium ${currentPage === number
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-emerald-50'
                            }`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default StdExtraNeeds
