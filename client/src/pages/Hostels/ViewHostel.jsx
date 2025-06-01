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

    const [availableWardens, setAvailableWardens] = useState([])
    const [selectedWarden, setSelectedWarden] = useState('')
    const [assignStatus, setAssignStatus] = useState('')

    // Fetch hostel details by ID
    const fetchHostel = () => {
        axios
            .get(`${import.meta.env.VITE_APP_API}/hostel/View-one-hostel/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setGetOneHostel(res.data.Result))
            .catch((err) => console.log('Error fetching hostel:', err))
    }

    // Fetch all wardens to populate the dropdown
    const fetchAvailableWardens = () => {
        axios
            .get(`${import.meta.env.VITE_APP_API}/hostel/get-all-warden`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log('Wardens API response:', res.data)
                // Make sure you access the right key (lowercase 'result' in your case)
                setAvailableWardens(res.data.result || [])
            })
            .catch((err) => {
                console.error('Error fetching wardens:', err)
                setAvailableWardens([])
            })
    }

    useEffect(() => {
        fetchHostel()
        fetchAvailableWardens()
    }, [id]) // add id dependency in case route param changes

    // Update room count API call
    const handleRoomCountUpdate = async () => {
        if (!newRoomCount || isNaN(newRoomCount) || newRoomCount <= 0) {
            setMessage('Please enter a valid room count')
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(
                `${import.meta.env.VITE_APP_API}/hostel/update-room-count/${id}`,
                { newRoomCount: parseInt(newRoomCount) },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMessage(res.data.Message || 'Room count updated successfully.')
            setNewRoomCount('')
            fetchHostel()
        } catch (error) {
            console.error('Error updating room count:', error)
            setMessage('Error updating room count')
        } finally {
            setLoading(false)
        }
    }

    // Assign new warden API call
    const handleAssignWarden = async () => {
        if (!selectedWarden) {
            setAssignStatus('Please select a warden.')
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(
                `${import.meta.env.VITE_APP_API}/hostel/assign-warden`,
                {
                    hostelId: id,
                    newWardenId: selectedWarden,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setAssignStatus(res.data.Message || 'Warden assigned successfully.')
            setSelectedWarden('')
            fetchHostel()
        } catch (err) {
            console.error('Error assigning warden:', err)
            setAssignStatus('Error assigning warden.')
        } finally {
            setLoading(false)
        }
    }

    if (!getonehostel) {
        return (
            <div className="text-center mt-10 text-gray-500">
                Loading hostel details...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* View Details */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <h1 className="font-bold text-emerald-600 text-xl">
                    View Hostel: {getonehostel?.name}
                </h1>
                <div className="grid md:grid-cols-3 gap-4 text-sm mt-8">
                    <Detail label="Hostel ID" value={getonehostel.hostelID} />
                    <Detail label="Hostel Name" value={getonehostel.name} />
                    <Detail
                        label="Location"
                        value={
                            <a
                                href={getonehostel.location}
                                target="_blank"
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
                        min="1"
                    />
                    <button
                        onClick={handleRoomCountUpdate}
                        disabled={loading}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
                {message && <p className="mt-2 text-sm text-emerald-700">{message}</p>}
            </div>

            {/* Assign New Warden */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
                <h1 className="font-bold text-emerald-600 text-xl mb-4">Assign New Warden</h1>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedWarden}
                        onChange={(e) => setSelectedWarden(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full md:w-64"
                    >
                        <option value="">-- Select Warden --</option>
                        {availableWardens.length === 0 && (
                            <option disabled>No wardens available</option>
                        )}
                        {availableWardens.map((warden) => (
                            <option key={warden._id} value={warden._id}>
                                {warden.username} - {warden.email}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAssignWarden}
                        disabled={loading}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {loading ? 'Assigning...' : 'Assign'}
                    </button>
                </div>
                {assignStatus && <p className="mt-2 text-sm text-emerald-700">{assignStatus}</p>}
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
