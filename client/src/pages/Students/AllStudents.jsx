import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import localStorage from 'react-secure-storage'
import DefaultInput from '../../components/Form/DefaultInput'
import { FaFemale, FaMale } from 'react-icons/fa'
import Dropdown from '../../components/Form/Dropdown'

const AllStudents = () => {
    const [allstds, setAllStds] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [assignmentStatus, setAssignmentStatus] = useState('All')
    const [minDistance, setMinDistance] = useState('')
    const [maxDistance, setMaxDistance] = useState('') // ✅ Added maxDistance state
    const [genderFilter, setGenderFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const recordsPerPage = 15
    const token = localStorage.getItem('login')

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_APP_API + '/student/get-all-students-auth', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setAllStds(res.data.Result)
                setFilteredStudents(res.data.Result)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const term = searchTerm.toLowerCase()

        const filtered = allstds.filter(student => {
            const matchesSearch =
                student.nic?.toLowerCase().includes(term) ||
                student.enrolmentNo?.toLowerCase().includes(term) ||
                student.indexNo?.toLowerCase().includes(term)

            const matchesAssigned =
                assignmentStatus === 'All'
                    ? true
                    : assignmentStatus === 'Assigned'
                        ? student.isAssign === true
                        : student.isAssign !== true

            const matchesDistance =
                (minDistance === '' || (student.distance && student.distance >= Number(minDistance))) &&
                (maxDistance === '' || (student.distance && student.distance <= Number(maxDistance))) // ✅ Updated condition

            const matchesGender = genderFilter === '' || student.sex === genderFilter

            return matchesSearch && matchesAssigned && matchesDistance && matchesGender
        })

        setFilteredStudents(filtered)
        setCurrentPage(1)
    }, [searchTerm, allstds, assignmentStatus, minDistance, maxDistance, genderFilter]) // ✅ added maxDistance

    const totalPages = Math.ceil(filteredStudents.length / recordsPerPage)
    const paginatedData = filteredStudents.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    )

    const exportToCSV = () => {
        const headers = [
            'No',
            'Enrolment No',
            'Index No',
            'Name',
            'Title',
            'Last Name',
            'Initials',
            'Full Name',
            'A/L District',
            'Sex',
            'Z-Score',
            'Medium',
            'NIC',
            'Address Line 1',
            'Address Line 2',
            'Address Line 3',
            'Full Address',
            'Email',
            'Phone 1',
            'Phone 2',
            'General English Marks',
            'Intake',
            'Date of Enrolment',
            'Distance (Km)',
            'Hostel Assigned'
        ]

        const rows = filteredStudents.map(std => [
            std.no || '',
            std.enrolmentNo || '',
            std.indexNo || '',
            std.name || '',
            std.title || '',
            std.lastName || '',
            std.initials || '',
            std.fullName || '',
            std.alDistrict || '',
            std.sex || '',
            std.zScore ?? '',
            std.medium || '',
            `'${std.nic || ''}`,
            std.address1 || '',
            std.address2 || '',
            std.address3 || '',
            std.fullAddress || '',
            std.email || '',
            `'${std.phone1 || ''}`,
            `'${std.phone2 || ''}`,
            std.genEnglishMarks ?? '',
            std.intake || '',
            std.dateOfEnrolment ? new Date(std.dateOfEnrolment).toLocaleDateString() : '',
            std.distance ?? '',
            std.isAssign ? 'Assigned' : 'Not Assigned'
        ])

        const csvContent = 'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map(row => row.map(field => `"${field}"`).join(','))].join('\n')

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'students_export.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="mt-8">
            <div className="mb-4 flex flex-nowrap items-center gap-12">
                <DefaultInput
                    label="Search by NIC, Enrolment No, or Index No"
                    name="search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Enter search term..."
                    className="w-full"
                />
                <Dropdown
                    inline
                    label="Assignment Status"
                    name="assignmentStatus"
                    value={assignmentStatus}
                    onChange={e => setAssignmentStatus(e.target.value)}
                    options={[
                        { value: 'All', label: 'All' },
                        { value: 'Assigned', label: 'Assigned' },
                        { value: 'Unassigned', label: 'Unassigned' },
                    ]}
                    className="w-44"
                />
                <DefaultInput
                    label="Min Distance (Km)"
                    name="minDistance"
                    type="number"
                    min="0"
                    value={minDistance}
                    onChange={e => setMinDistance(e.target.value)}
                    placeholder="Enter minimum distance"
                    className="w-full"
                />
                <DefaultInput
                    label="Max Distance (Km)" // ✅ Added max distance input
                    name="maxDistance"
                    type="number"
                    min="0"
                    value={maxDistance}
                    onChange={e => setMaxDistance(e.target.value)}
                    placeholder="Enter maximum distance"
                    className="w-full"
                />
                <Dropdown
                    inline
                    label="Gender"
                    name="genderFilter"
                    value={genderFilter}
                    onChange={e => setGenderFilter(e.target.value)}
                    options={[
                        { value: '', label: 'All' },
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                    ]}
                    className="w-44"
                />
                <button
                    onClick={exportToCSV}
                    className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
                >
                    Export CSV
                </button>
            </div>

            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Enrolment No</th>
                            <th className="px-6 py-4">Index No</th>
                            <th className="px-6 py-4">NIC</th>
                            <th className="px-6 py-4">Gender</th>
                            <th className="px-6 py-4">Home Town</th>
                            <th className="px-6 py-4">Distance</th>
                            <th className="px-6 py-4">Hostel Assigned</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((data, index) => (
                                <tr key={index} className="hover:bg-emerald-50 transition-all duration-150">
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {(currentPage - 1) * recordsPerPage + index + 1}
                                    </td>
                                    <td className="px-6 py-4">{data.enrolmentNo}</td>
                                    <td className="px-6 py-4">{data.indexNo}</td>
                                    <td className="px-6 py-4">{data.nic}</td>
                                    <td className="px-6 py-4">
                                        {data.sex === 'Male' ? (
                                            <span className="flex bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full gap-1 items-center">
                                                <FaMale className="h-4 w-auto" />
                                                Male
                                            </span>
                                        ) : (
                                            <span className="flex bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full gap-1 items-center">
                                                <FaFemale className="h-4 w-auto" />
                                                Female
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{data.address3}</td>
                                    <td className="px-6 py-4">{data.distance} Km</td>
                                    <td className="px-6 py-4">
                                        {data.isAssign ? (
                                            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                Assigned
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                Not Assigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/Dashboard/View-Student/${data._id}`}
                                            className="text-emerald-600 font-medium hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-4 text-gray-700">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 hover:bg-emerald-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 hover:bg-emerald-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllStudents
