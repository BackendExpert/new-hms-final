import React, { useEffect, useState } from 'react';
import { getUserInfoFromToken } from '../../utils/auth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DefaultBtn from '../../components/Buttons/DefaultBtn';

const AssignStundetToRoomSp = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { username, roles } = getUserInfoFromToken() || {};
    const token = localStorage.getItem('login');

    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    const [getallrooms, setgetallrooms] = useState([]);
    const [getsdt, setgetstd] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/warden/all-rooms', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => setgetallrooms(res.data.Result))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_API}/student/get-student-byID/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => setgetstd(res.data.Result))
            .catch(err => console.log(err));
    }, [id]);

    const handleAssignRoom = async (e) => {
        e.preventDefault();
        if (!selectedRoomId) {
            setMessage('Please select a room');
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API}/warden/assign-room-special`, {
                studentId: id,
                roomId: selectedRoomId
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.Status === "Success") {
                alert(res.data.Message)
                navigate('/Dashboard/AssignStudentViaNeeds')
            } else {
                alert(res.data.Error || 'Failed to assign room');
            }
        } catch (err) {
            console.error(err);
            setMessage('Something went wrong.');
        }
    };

    if (!(roleNames.includes('admin') || roleNames.includes('director') || roleNames.includes('warden'))) return null;

    return (
        <div>
            <div className="-mt-4 mb-2">
                <Link to={'/Dashboard/AssignStudentViaNeeds'}>
                    <DefaultBtn type='button' label='Back' />
                </Link>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-emerald-600">Assign Student Room - {id}</h2>
                <p className="text-gray-500 text-sm">(via Special Needs)</p>
            </div>

            <div className="mb-4">
                <h1 className="text-gray-500 font-bold text-2xl mb-4">Student Information</h1>
                <div className="grid grid-cols-3 gap-4">
                    <Detail label="Student Email" value={getsdt?.email} />
                    <Detail label="Student Index No" value={getsdt?.indexNo} />
                    <Detail label="Student NIC" value={getsdt?.nic} />
                    <Detail label="Student Enrolment No" value={getsdt?.enrolmentNo} />
                </div>
            </div>

            <div>
                <h1 className="text-xl font-semibold text-emerald-600">Assign Room for Student</h1>
                <form onSubmit={handleAssignRoom} className="mt-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Available Rooms</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {getallrooms.map((room, index) => {
                                if (room.currentOccupants !== 4 && room.status !== "Full") {
                                    return (
                                        <label
                                            key={index}
                                            className={`border rounded-2xl p-5 shadow-sm cursor-pointer transition-all duration-300 
                                hover:shadow-md hover:border-emerald-500
                                ${selectedRoomId === room._id ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-gray-300'}
                            `}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <input
                                                    type="radio"
                                                    name="room"
                                                    value={room._id}
                                                    onChange={() => setSelectedRoomId(room._id)}
                                                    checked={selectedRoomId === room._id}
                                                    className="mt-1 accent-emerald-600 w-5 h-5"
                                                />
                                                <div>
                                                    <p className="text-lg font-medium text-gray-900">{room.roomID}</p>
                                                    <p className="text-sm text-gray-500">Occupants: {room.currentOccupants}/4</p>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    <div className="pt-4">
                        <DefaultBtn type="submit" label="✅ Assign Room to Student" />
                        {message && (
                            <p className="mt-3 text-sm font-medium text-red-600">
                                {message}
                            </p>
                        )}
                    </div>
                </form>

            </div>
        </div>
    );
};

const Detail = ({ label, value }) => (
    <div>
        <p className="text-emerald-600 font-semibold">{label}</p>
        <p className="text-gray-800">{value || '-'}</p>
    </div>
);

export default AssignStundetToRoomSp;
