import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'

const ViewHostel = () => {
    const { id } = useParams()
    const token = secureLocalStorage.getItem('login')

    const [getonehostel, setGetOneHostel] = useState(null)
    const [newRoomCount, setNewRoomCount] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const fetchHostel = () => {
        axios.get(`${import.meta.env.VITE_APP_API}/hostel/View-one-hostel/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => setGetOneHostel(res.data.Result))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchHostel()
    }, [])

    const handleRoomCountUpdate = async () => {
        if (!newRoomCount || isNaN(newRoomCount) || newRoomCount <= 0) {
            setMessage('Please enter a valid room count')
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_APP_API}/hostel/update-room-count/${id}`, {
                newRoomCount: parseInt(newRoomCount)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setMessage(res.data.Message || 'Room count updated successfully.')
            fetchHostel()
        } catch (error) {
            console.error(error)
            setMessage('Error updating room count')
        } finally {
            setLoading(false)
        }
    }

    if (!getonehostel) {
        return <div className="text-center mt-10 text-gray-500">Loading...</div>
    }

    return (
        <div className="space-y-6">
            {/* View Details */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <h1 className="font-bold text-emerald-600 text-xl">View Hostel: {getonehostel?.name}</h1>

                <div className="grid md:grid-cols-3 gap-4 text-sm mt-8">
                    <Detail label="Hostel ID" value={getonehostel.hostelID} />
                    <Detail label="Hostel Name" value={getonehostel.name} />
                    <Detail
                        label="Location"
                        value={
                            <a
                                href={getonehostel.location}
                                target='_blank'
                                rel="noopener noreferrer"
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Open Location
                            </a>
                        }
                    />
                    <Detail label="Hostel Warden" value={getonehostel?.warden?.username} />
                    <Detail label="Warden Email" value={getonehostel?.warden?.email} />
                    <Detail label="Room Count" value={getonehostel?.roomCount} />
                </div>
            </div>

            {/* Update Room Count */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
                <h1 className="font-bold text-emerald-600 text-xl">Update Room Count</h1>
                <div className="mt-4 flex items-center gap-4">
                    <input
                        type="number"
                        className="border rounded-md px-4 py-2 w-40"
                        placeholder="Enter new count"
                        value={newRoomCount}
                        onChange={(e) => setNewRoomCount(e.target.value)}
                    />
                    <button
                        onClick={handleRoomCountUpdate}
                        disabled={loading}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
                {message && (
                    <p className="mt-2 text-sm text-emerald-700">{message}</p>
                )}
            </div>

            {/* Assign New Warden */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
                <h1 className="font-bold text-emerald-600 text-xl">Assign New Warden</h1>
                <p className="text-sm mt-2 text-gray-500">Feature coming soon...</p>
            </div>
        </div>
    )
}

const Detail = ({ label, value }) => (
    <div>
        <p className="text-emerald-600 font-semibold">{label}</p>
        <p className="text-gray-800">{value || '-'}</p>
    </div>
)

export default ViewHostel
