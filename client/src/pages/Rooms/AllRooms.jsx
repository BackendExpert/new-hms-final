import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import localStorage from 'react-secure-storage'
import DefaultInput from '../../components/Form/DefaultInput'
import Dropdown from '../../components/Form/Dropdown'
import { FaRegCheckSquare } from "react-icons/fa"
import { BsHouseGearFill } from "react-icons/bs"
import { MdOutlineDoNotDisturbAlt } from "react-icons/md"

const AllRooms = () => {
    const token = localStorage.getItem('login')
    const [roomdata, setroomdata] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [genderFilter, setGenderFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/room/get-all-rooms', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setroomdata(res.data.Result)
                setFilteredData(res.data.Result)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        filterRooms()
    }, [searchTerm, statusFilter, genderFilter, roomdata])

    const filterRooms = () => {
        const term = searchTerm.toLowerCase()

        const filtered = roomdata.filter((room) => {
            const matchesSearch = room.roomID.toLowerCase().includes(term) ||
                room?.hostelID?.name?.toLowerCase().includes(term)

            const matchesStatus = statusFilter ? room.status === statusFilter : true
            const matchesGender = genderFilter ? room.gender === genderFilter : true

            return matchesSearch && matchesStatus && matchesGender
        })

        setFilteredData(filtered)
        setCurrentPage(1)
    }

    const handleSearch = (e) => setSearchTerm(e.target.value)
    const handleStatusChange = (e) => setStatusFilter(e.target.value)
    const handleGenderChange = (e) => setGenderFilter(e.target.value)

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) setCurrentPage(page)
    }

    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <DefaultInput
                    label="Search"
                    name="search"
                    placeholder="Search by Room ID or Hostel Name..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

                <Dropdown
                    label="Filter by Status"
                    name="status"
                    value={statusFilter}
                    onChange={handleStatusChange}
                    options={[
                        { label: "Available", value: "Availabe" },
                        { label: "Repair", value: "Repair" },
                        { label: "Full", value: "Full" }
                    ]}
                />

                <Dropdown
                    label="Filter by Gender"
                    name="gender"
                    value={genderFilter}
                    onChange={handleGenderChange}
                    options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" }
                    ]}
                />
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Room No</th>
                            <th className="px-6 py-4 font-semibold">Current Occupants</th>
                            <th className="px-6 py-4 font-semibold">Capacity</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Gender</th>
                            <th className="px-6 py-4 font-semibold">Hostel</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {
                            currentItems.length > 0 ? currentItems.map((data, index) => (
                                <tr key={index} className="hover:bg-emerald-50 transition-all duration-150">
                                    <td className="px-6 py-4 font-medium text-gray-800">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-6 py-4">{data.roomID}</td>
                                    <td className="px-6 py-4">{data.currentOccupants}</td>
                                    <td className="px-6 py-4">{data.capasity}</td>
                                    <td className="px-6 py-4">
                                        {
                                            data.status === "Availabe" ? (
                                                <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <FaRegCheckSquare className="h-4 w-auto" /> Available
                                                </span>
                                            ) : data.status === "Repair" ? (
                                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <BsHouseGearFill className="h-4 w-auto" /> Repair
                                                </span>
                                            ) : data.status === "Full" ? (
                                                <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    <MdOutlineDoNotDisturbAlt className="h-4 w-auto" /> Full
                                                </span>
                                            ) : null
                                        }
                                    </td>
                                    <td className="px-6 py-4">{data.gender}</td>
                                    <td className="px-6 py-4">{data?.hostelID?.name}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/Dashboard/View-Room/${data._id}`} className="text-emerald-600 font-medium hover:underline">View</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No matching records found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded hover:bg-emerald-100 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-100'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded hover:bg-emerald-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllRooms
