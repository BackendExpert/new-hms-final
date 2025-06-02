import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'


const ViewRoom = () => {
    const { id } = useParams()
    const token = secureLocalStorage.getItem('login')
    const [oneRoom, setoneRoom] = useState([])

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/room/get-one-room/' + id, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => setoneRoom(res.data.Result))
            .catch(err => console.log(err))
    }, [])
    return (
        <div className="">
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <div className="-mt-4 mb-2">
                    <Link to={'/Dashboard/Rooms'}>
                        <DefaultBtn type="button" label="Back" />
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-emerald-700 mb-4">Room Information: {oneRoom?.roomID}</h1>

                <div className="">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <Detail label={"Room ID"} value={oneRoom?.roomID} />
                        <Detail label={"Room Current Occupants"} value={oneRoom?.currentOccupants} />
                        <Detail label={"Room Capasity"} value={oneRoom?.capasity} />
                        <Detail label={"Room Gender"} value={oneRoom?.gender} />
                        <Detail label={"Room ID"} value={oneRoom?.hostelID?.name} />
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <h1 className="text-2xl font-bold text-emerald-700 mb-4">Update in Room Capasity</h1>
            </div>

            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
                <h1 className="text-2xl font-bold text-emerald-700 mb-4">Students in Room</h1>
                {oneRoom?.students?.length > 0 ? (
                    <ul className="space-y-2">
                        {oneRoom.students.map((student, index) => (
                            <li
                                key={student._id || index}
                                className="p-3 border border-gray-200 rounded-md bg-gray-50"
                            >
                                <p><span className="font-semibold">Name:</span> {student.fullName}</p>
                                <p><span className="font-semibold">Reg No:</span> {student.enrolmentNo}</p>
                                <p><span className="font-semibold">NIC:</span> {student.nic}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No students currently assigned to this room.</p>
                )}

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

export default ViewRoom