import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'

const ViewHostel = () => {
    const { id } = useParams()
    const token = secureLocalStorage.getItem('login')

    const [getonehostel, setgetonehostel] = useState([])

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/hostel/View-one-hostel/' + id, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => setgetonehostel(res.data.Result))
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="">
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <h1 className="font-bold text-emerald-600 text-xl">View Hostel : {getonehostel?.name}</h1>

                <div className="grid md:grid-cols-3 gap-4 text-sm mt-8">
                    <Detail label="Hostel ID" value={getonehostel.hostelID} />
                    <Detail label="Hostel Name" value={getonehostel.name} />

                    <Detail
                        label="Hostel Name"
                        value={
                            <a href={`${getonehostel.location}`} target='_blank' className='text-emerald-600 font-medium hover:underline'>
                                Location
                            </a>
                        }
                    />

                    <Detail label="Hostel Warden" value={getonehostel?.warden?.username} />
                    <Detail label="Warden Email" value={getonehostel?.warden?.email} />
                    <Detail label="Room Count Email" value={getonehostel?.roomCount} />
                </div>

            </div>

            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <h1 className="font-bold text-emerald-600 text-xl">Update Room Count</h1>
            </div>

            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <h1 className="font-bold text-emerald-600 text-xl">Assign New Warden</h1>
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