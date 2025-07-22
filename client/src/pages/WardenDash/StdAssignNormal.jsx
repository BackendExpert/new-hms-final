import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import { Link } from 'react-router-dom'
import { getUserInfoFromToken } from '../../utils/auth' // adjust path as needed

const StdAssignNormal = () => {
    const [students, setStudents] = useState([]) // expects [{ student, allocations }]
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedStudents, setSelectedStudents] = useState(new Set())

    const token = localStorage.getItem('login')
    const currentUser = useMemo(() => getUserInfoFromToken(), [])

    useEffect(() => {
        const fetchStudents = async () => {
            if (!token || !currentUser?.email) {
                setError('Unauthorized: Missing token or user info.')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)

                const url = `${import.meta.env.VITE_APP_API}/hostel/warden-students?wardenEmail=${encodeURIComponent(currentUser.email)}`
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setStudents(res.data.Result || [])
            } catch (err) {
                console.error('Error fetching students:', err)
                setError('Failed to fetch student data.')
            } finally {
                setLoading(false)
            }
        }

        fetchStudents()
    }, [token, currentUser.email])

    const toggleStudentSelection = (id) => {
        setSelectedStudents((prev) => {
            const updated = new Set(prev)
            if (updated.has(id)) {
                updated.delete(id)
            } else {
                updated.add(id)
            }
            return updated
        })
    }

    const toggleSelectAll = () => {
        if (selectedStudents.size === students.length) {
            setSelectedStudents(new Set())
        } else {
            setSelectedStudents(new Set(students.map(({ student }) => student._id)))
        }
    }

    const handleAssignToRooms = async () => {
        if (selectedStudents.size === 0) {
            alert('Please select at least one student to assign rooms.')
            return
        }

        const selectedIds = Array.from(selectedStudents)
        console.log('Selected student IDs:', selectedIds)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const res = await axios.post(import.meta.env.VITE_APP_API + '/warden/student-assign-to-rooms', selectedIds, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.data.Status === "Success") {
                console.log('Submitted student IDs:', selectedIds)
                alert('Rooms assigned successfully!')
                window.location.reload()
            }
            else {
                alert(res.data.Error)
            }
            setSelectedStudents(new Set())
        } catch (error) {
            console.error('Failed to assign rooms:', error)
            alert('Failed to assign rooms. Please try again.')
        }
    }

    return (
        <div>
            <div className="-mt-4 mb-2">
                <Link to={'/Dashboard/WardenStudents'}>
                    <DefaultBtn type="button" label="Back" />
                </Link>
            </div>

            {loading && <p className="mb-4 text-center text-blue-600">Loading students...</p>}
            {error && <p className="mb-4 text-center text-red-600">{error}</p>}

            <div className="overflow-x-auto rounded-2xl shadow-lg">
                <table className="min-w-full text-sm text-left text-gray-600 bg-white">
                    <thead className="text-xs uppercase bg-emerald-100 text-emerald-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">
                                <input
                                    type="checkbox"
                                    onChange={toggleSelectAll}
                                    checked={selectedStudents.size === students.length && students.length > 0}
                                    aria-label="Select all students"
                                />
                            </th>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Enrolment No</th>
                            <th className="px-6 py-4 font-semibold">Index No</th>
                            <th className="px-6 py-4 font-semibold">NIC</th>
                            <th className="px-6 py-4 font-semibold">Gender</th>
                            <th className="px-6 py-4 font-semibold">Home Town</th>
                            <th className="px-6 py-4 font-semibold">Distance</th>
                            <th className="px-6 py-4 font-semibold">Room IDs</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.length === 0 && !loading && (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-400">
                                    No students found.
                                </td>
                            </tr>
                        )}
                        {students
                            .filter(({ allocations }) =>
                                allocations?.some(a => !a.roomId) // Only include students with at least one unassigned room
                            )
                            .map(({ student, allocations }, index) => {
                                const id = student._id || index

                                return (
                                    <tr key={id}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.has(id)}
                                                onChange={() => toggleStudentSelection(id)}
                                                aria-label={`Select student ${student.enrolmentNo || index + 1}`}
                                            />
                                        </td>
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{student.enrolmentNo || '-'}</td>
                                        <td className="px-6 py-4">{student.indexNo || '-'}</td>
                                        <td className="px-6 py-4">{student.nic || '-'}</td>
                                        <td className="px-6 py-4">{student.sex || '-'}</td>
                                        <td className="px-6 py-4">{student.address3 || '-'}</td>
                                        <td className="px-6 py-4">{student.distance || '-'}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end">
                <DefaultBtn
                    type="button"
                    label="Assign to Rooms"
                    onClick={handleAssignToRooms}
                    disabled={selectedStudents.size === 0}
                />
            </div>
        </div>
    )
}

export default StdAssignNormal
