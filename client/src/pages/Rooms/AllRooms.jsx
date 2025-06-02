import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import DefaultInput from '../../components/Form/DefaultInput'
import { FaRegCheckSquare } from "react-icons/fa";
import { BsHouseGearFill } from "react-icons/bs";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";


const AllRooms = () => {
    const token = secureLocalStorage.getItem('login')
    const [roomdata, setroomdata] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
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

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase()
        setSearchTerm(term)

        const filtered = roomdata.filter((room) =>
            room.roomID.toLowerCase().includes(term) ||
            room?.hostelID?.name?.toLowerCase().includes(term)
        )

        setFilteredData(filtered)
        setCurrentPage(1)
    }

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="p-4 space-y-4">
            <DefaultInput
                label="Search"
                name="search"
                placeholder="Search by Room ID or Hostel Name..."
                value={searchTerm}
                onChange={handleSearch}
            />

            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Room No</th>
                            <th className="px-6 py-4 font-semibold">Current Occupants</th>
                            <th className="px-6 py-4 font-semibold">Capacity</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Hostel</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {
                            currentItems.length > 0 ? (
                                currentItems.map((data, index) => (
                                    <tr key={index} className="hover:bg-emerald-50 transition-all duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-800">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-6 py-4">{data.roomID}</td>
                                        <td className="px-6 py-4">{data.currentOccupants}</td>
                                        <td className="px-6 py-4">{data.capasity}</td>
                                        <td className='px-6 py-4'>
                                            {
                                                (() => {
                                                    if (data.status === "Availabe") {
                                                        return (
                                                            <div className="">
                                                                <span
                                                                    className="flex uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                                >
                                                                    <FaRegCheckSquare className='h-4 w-auto' />
                                                                    Availabe
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                    else if (data.status === "Repair") {
                                                        return (
                                                            <div className="">
                                                                <span
                                                                    className="flex uppercase bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                                >
                                                                    <BsHouseGearFill className='h-4 w-auto' />
                                                                    Repair
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                    else if (data.status === "Full") {
                                                        return (
                                                            <div className="">
                                                                <span
                                                                    className="flex uppercase bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full"
                                                                >
                                                                    <MdOutlineDoNotDisturbAlt className='h-4 w-auto' />
                                                                    Full
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                })()
                                            }
                                        </td>
                                        <td className="px-6 py-4">{data?.hostelID?.name}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/Dashboard/View-Room/${data._id}`} className="text-emerald-600 font-medium hover:underline">View</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No matching records found.</td>
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
