import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DefaultInput from '../../components/Form/DefaultInput'
import { FaRegCheckSquare } from 'react-icons/fa'
import { BsHouseGearFill } from 'react-icons/bs'

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
                console.log("API raw data:", res.data)
                if (res.data && res.data.Result) {
                    setGetExtraNeeds(res.data.Result)
                    setFilteredData(res.data.Result)
                } else {
                    console.error("API returned no Result:", res.data)
                    setGetExtraNeeds([])
                    setFilteredData([])
                }
            })
            .catch(err => {
                console.error("API error:", err)
                setGetExtraNeeds([])
                setFilteredData([])
            })
    }, [])

    useEffect(() => {
        const filtered = (getExtraNeeds || []).filter(item =>
            item.regNo?.email?.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredData(filtered)
        setCurrentPage(1)
    }, [search, getExtraNeeds])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = (filteredData || []).slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil((filteredData || []).length / itemsPerPage)

    const headleApprove = async (id) => {
        try {
            const res = await axios.post(import.meta.env.VITE_APP_API + '/warden/approve-need/' + id, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.data.Status === "Success") {
                alert("Student Need Approve Success")
                window.location.reload()
            } else {
                alert(res.data.Error)
            }
        } catch (err) {
            console.log(err)
        }
    }

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
                            <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {(currentItems || []).length > 0 ? currentItems.map((data, index) => (
                            <tr key={data._id} className="hover:bg-emerald-50 transition-all duration-150">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {indexOfFirstItem + index + 1}
                                </td>
                                <td className="px-6 py-4">
                                    {data.regNo?.email || "N/A"}
                                </td>
                                <td className="px-6 py-4">{data.needs}</td>
                                <td className="px-6 py-4">
                                    {data.isAccpeted === true && (
                                        <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                            <FaRegCheckSquare className="h-4 w-auto" /> Approved
                                        </span>
                                    )}
                                    {data.isAccpeted === false && (
                                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                            <BsHouseGearFill className="h-4 w-auto" /> Pending / Rejected
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {data.isAccpeted === true ? (
                                        <div className="text-emerald-800">Approved</div>
                                    ) : (
                                        <div
                                            className="text-emerald-800 hover:underline cursor-pointer"
                                            onClick={() => headleApprove(data._id)}
                                        >
                                            Approve
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No matching records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`px-3 py-1 rounded-md border text-sm font-medium ${
                            currentPage === number
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
