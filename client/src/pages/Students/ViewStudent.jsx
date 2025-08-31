import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import DefaultBtn from '../../components/Buttons/DefaultBtn';
import DefaultInput from '../../components/Form/DefaultInput';
import { getUserInfoFromToken } from '../../utils/auth';

const ViewStudent = () => {
    const { id } = useParams();
    const [stdData, setStdData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const token = localStorage.getItem('login');

    const userInfo = getUserInfoFromToken();
    const userRoles = (userInfo?.roles || [])
        .map(r => (typeof r === 'string' ? r.toLowerCase() : r.name?.toLowerCase?.()))
        .filter(Boolean);

    // Role-based access control
    const allowedRoles = ['warden', 'admin', 'director'];
    const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

    if (!isAuthorized) return <Navigate to="/" replace />;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_API}/student/get-student-byID/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            const allocation = res.data.Result;
            if (!allocation) return console.log("No allocation found for this student");

            setStdData(allocation);                 // Allocation object
            setFormData(allocation.regNo || {});    // Student data for form
            console.log("Allocation:", allocation); // Debug
        })
        .catch(err => console.log(err));
    }, [id, token]);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_APP_API}/student/update-Student/${id}`,
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (res.data.Status === "Success") {
                alert(res.data.Message);
                window.location.reload();
            } else {
                alert(res.data.Error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (!stdData) return <div className="text-gray-500">Loading student data...</div>;

    const student = stdData?.regNo || {};
    const room = stdData?.roomId || {};
    const hostel = stdData?.hostelID || {};

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg mt-5">
            <div className="flex justify-between items-center -mt-4 mb-2">
                <Link to={
                    userRoles.includes('warden')
                        ? '/Dashboard/WardenStudents'
                        : '/Dashboard/Students'
                }>
                    <DefaultBtn type="button" label="Back" />
                </Link>
                <DefaultBtn type="button" label={isEditing ? 'Cancel' : 'Edit'} onClick={handleEditToggle} />
            </div>

            <h1 className="text-2xl font-bold text-emerald-700 mb-4">Student Information</h1>

            {!isEditing ? (
                <>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <Detail label="Enrolment No" value={student.enrolmentNo} />
                        <Detail label="Index No" value={student.indexNo} />
                        <Detail label="NIC" value={student.nic} />
                        <Detail label="Name" value={student.name} />
                        <Detail label="Title" value={student.title} />
                        <Detail label="Last Name" value={student.lastName} />
                        <Detail label="Initials" value={student.initials} />
                        <Detail label="Full Name" value={student.fullName} />
                        <Detail label="AL District" value={student.alDistrict} />
                        <Detail label="Sex" value={student.sex} />
                        <Detail label="Z-Score" value={student.zScore} />
                        <Detail label="Medium" value={student.medium} />
                        <Detail label="Address 1" value={student.address1} />
                        <Detail label="Address 2" value={student.address2} />
                        <Detail label="Address 3" value={student.address3} />
                        <Detail label="Full Address" value={student.fullAddress} />
                        <Detail label="Email" value={student.email} />
                        <Detail label="Phone 1" value={student.phone1} />
                        <Detail label="Phone 2" value={student.phone2} />
                        <Detail label="General English Marks" value={student.genEnglishMarks} />
                        <Detail label="Intake" value={student.intake} />
                        <Detail label="Date of Enrolment" value={student.dateOfEnrolment ? new Date(student.dateOfEnrolment).toLocaleDateString() : '-'} />
                        <Detail label="Distance" value={student.distance ? student.distance + ' km' : '-'} />
                        <Detail label="Assigned" value={student.isAssign ? 'Yes' : 'No'} />
                    </div>

                    <h2 className="text-xl font-semibold text-emerald-700 mt-6 mb-2">Room & Hostel Information</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <Detail label="Room ID" value={room.roomID} />
                        <Detail label="Room Status" value={room.status} />
                        <Detail label="Room Capacity" value={room.capasity} />
                        <Detail label="Current Occupants" value={room.currentOccupants} />
                        <Detail label="Room Gender" value={room.gender} />

                        <Detail label="Hostel ID" value={hostel.hostelID} />
                        <Detail label="Hostel Name" value={hostel.name} />
                        <Detail label="Hostel Location" value={hostel.location} />
                        <Detail label="Hostel Gender" value={hostel.gender} />
                        <Detail label="Room Count" value={hostel.roomCount} />
                    </div>
                </>
            ) : (
                <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4 text-sm">
                    {[
                        { name: 'name', label: 'Name' },
                        { name: 'title', label: 'Title' },
                        { name: 'lastName', label: 'Last Name' },
                        { name: 'initials', label: 'Initials' },
                        { name: 'fullName', label: 'Full Name' },
                        { name: 'alDistrict', label: 'AL District' },
                        { name: 'zScore', label: 'Z-Score', type: 'number' },
                        { name: 'medium', label: 'Medium' },
                        { name: 'address1', label: 'Address 1' },
                        { name: 'address2', label: 'Address 2' },
                        { name: 'address3', label: 'Address 3' },
                        { name: 'fullAddress', label: 'Full Address' },
                        { name: 'phone1', label: 'Phone 1' },
                        { name: 'phone2', label: 'Phone 2' },
                        { name: 'genEnglishMarks', label: 'General English Marks', type: 'number' },
                        { name: 'intake', label: 'Intake' },
                        { name: 'dateOfEnrolment', label: 'Date of Enrolment', type: 'date' },
                        { name: 'distance', label: 'Distance (km)', type: 'number' }
                    ].map(field => (
                        <DefaultInput
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            type={field.type || 'text'}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                        />
                    ))}
                    <div className="col-span-2 -mt-4">
                        <DefaultBtn type="submit" label="Update Student" />
                    </div>
                </form>
            )}
        </div>
    );
};

const Detail = ({ label, value }) => (
    <div>
        <p className="text-emerald-600 font-semibold">{label}</p>
        <p className="text-gray-800">{value || '-'}</p>
    </div>
);

export default ViewStudent;
