import React, { useEffect, useState } from 'react'
import DefaultInput from '../../components/Form/DefaultInput'
import Dropdown from '../../components/Form/Dropdown'
import { FaFemale, FaMale } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'


const HostelAssign = () => {
    const [getallstudents, setgetallstudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [filters, setFilters] = useState({
        search: '',
        distance: '',
        gender: '',
    })
    const token = localStorage.getItem('login')

    const [allhostels, setAllHostels] = useState([])
    const [selectedHostel, setSelectedHostel] = useState('')
    const [selectedStudents, setSelectedStudents] = useState(new Set())

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/student/get-all-students-auth', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setgetallstudents(res.data.Result)
                setFilteredStudents(res.data.Result)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/hostel/get-all-hostels', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setAllHostels(res.data.Result))
            .catch(err => console.error("Failed to fetch hostels:", err))
    }, [])

    useEffect(() => {
        let filtered = getallstudents

        if (filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase()
            filtered = filtered.filter(student =>
                (student.enrolmentNo?.toLowerCase().includes(searchTerm) ||
                    student.indexNo?.toLowerCase().includes(searchTerm) ||
                    student.nic?.toLowerCase().includes(searchTerm))
            )
        }

        if (filters.distance.trim() !== '') {
            const distNum = Number(filters.distance)
            if (!isNaN(distNum)) {
                filtered = filtered.filter(student => Number(student.distance) >= distNum)
            }
        }

        if (filters.gender !== '') {
            filtered = filtered.filter(student => student.sex === filters.gender)
        }

        setFilteredStudents(filtered)
    }, [filters, getallstudents])

    const handleFilterChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents(prev => {
            const newSelected = new Set(prev)
            if (newSelected.has(studentId)) {
                newSelected.delete(studentId)
            } else {
                newSelected.add(studentId)
            }
            return newSelected
        })
    }

    const handleHostelChange = (e) => {
        setSelectedHostel(e.target.value)
    }

    const handleAssignSubmit = () => {
        if (!selectedHostel) {
            alert('Please select a hostel first.')
            return
        }

        if (selectedStudents.size === 0) {
            alert('Please select at least one student.')
            return
        }

        const payload = {
            hostelId: selectedHostel,
            studentIds: Array.from(selectedStudents),
        }

        axios.post(import.meta.env.VITE_APP_API + '/hostel/assign-students', payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                alert('Students assigned successfully!')
                setSelectedStudents(new Set())
                axios.get(import.meta.env.VITE_APP_API + '/student/get-all-students-auth', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(res => {
                        setgetallstudents(res.data.Result)
                        setFilteredStudents(res.data.Result)
                    })
            })
            .catch(err => {
                console.error(err)
                alert('Failed to assign students. Please try again.')
            })
    }

    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Assign Students to Hostels</h1>

            <div className="flex flex-wrap gap-4 mt-4 max-w-3xl">
                <div className="flex-grow min-w-[250px]">
                    <DefaultInput
                        label="Search Enrolment No / Index No / NIC"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Enter enrolment, index or NIC"
                    />
                </div>
                <div className="min-w-[150px]">
                    <DefaultInput
                        label="Distance ≥"
                        type="number"
                        name="distance"
                        value={filters.distance}
                        onChange={handleFilterChange}
                        placeholder="Enter minimum distance"
                        min="0"
                    />
                </div>
                <div className="min-w-[150px]">
                    <Dropdown
                        label="Gender"
                        name="gender"
                        value={filters.gender}
                        onChange={handleFilterChange}
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' },
                        ]}
                    />
                </div>
            </div>

            <div className="max-w-3xl">
                <Dropdown
                    label="Select Hostel"
                    name="hostel"
                    value={selectedHostel}
                    onChange={handleHostelChange}
                    options={allhostels.map(h => ({ label: h.name, value: h._id }))}
                />
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg mt-4 max-w-7xl">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Select</th>
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
                            filteredStudents.filter(student => student.isAssign === false).length > 0 ? (
                                filteredStudents
                                    .filter(student => student.isAssign === false)
                                    .map((data, index) => (
                                        <tr
                                            key={data._id}
                                            onClick={() => handleCheckboxChange(data._id)}
                                            className={`transition-all duration-150 cursor-pointer ${
                                                selectedStudents.has(data._id)
                                                    ? 'bg-emerald-100 text-emerald-900'
                                                    : 'hover:bg-emerald-50'
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.has(data._id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation()
                                                        handleCheckboxChange(data._id)
                                                    }}
                                                    disabled={data.isAssign}
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                                            <td className="px-6 py-4">{data.enrolmentNo}</td>
                                            <td className="px-6 py-4">{data.indexNo}</td>
                                            <td className="px-6 py-4">{data.nic}</td>
                                            <td className="px-6 py-4">
                                                {data.sex === 'Male' ? (
                                                    <span className="flex uppercase bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                        <FaMale className='h-4 w-auto mr-1' /> Male
                                                    </span>
                                                ) : (
                                                    <span className="flex uppercase bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                        <FaFemale className='h-4 w-auto mr-1' /> Female
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">{data.address3}</td>
                                            <td className="px-6 py-4">{data.distance} Km</td>
                                            <td className="px-6 py-4">
                                                <span className="uppercase bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                    Not-Assigned
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link to={`/Dashboard/View-Student/${data._id}`} className="text-emerald-600 font-medium hover:underline">View</Link>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 text-center text-gray-500">No matching records found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            <div className="mt-6 max-w-3xl">
                <button
                    onClick={handleAssignSubmit}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-semibold disabled:bg-gray-400"
                    disabled={!selectedHostel || selectedStudents.size === 0}
                >
                    Assign Selected Students to Hostel
                </button>
            </div>
        </div>
    )
}

export default HostelAssign
