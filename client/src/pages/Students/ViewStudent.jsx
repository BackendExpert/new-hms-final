import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import DefaultInput from '../../components/Form/DefaultInput';
import { getUserInfoFromToken } from '../../utils/auth';

const ViewStudent = () => {
    const { id } = useParams();
    const [stdData, setStdData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const token = secureLocalStorage.getItem('login');

    const userInfo = getUserInfoFromToken();
    const userRoles = (userInfo?.roles || [])
        .map(r => (typeof r === 'string' ? r.toLowerCase() : r.name?.toLowerCase?.()))
        .filter(Boolean);


    // ✅ Role-based access control (lowercase match)
    const allowedRoles = ['warden', 'admin', 'director'];
    const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_API}/student/get-student-byID/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                setStdData(res.data.Result);
                setFormData(res.data.Result);
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
            const res = await axios.post(`${import.meta.env.VITE_APP_API}/student/update-Student/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
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
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <Detail label="Enrolment No" value={stdData.enrolmentNo} />
                    <Detail label="Index No" value={stdData.indexNo} />
                    <Detail label="NIC" value={stdData.nic} />
                    <Detail label="Name" value={stdData.name} />
                    <Detail label="Title" value={stdData.title} />
                    <Detail label="Last Name" value={stdData.lastName} />
                    <Detail label="Initials" value={stdData.initials} />
                    <Detail label="Full Name" value={stdData.fullName} />
                    <Detail label="AL District" value={stdData.alDistrict} />
                    <Detail label="Sex" value={stdData.sex} />
                    <Detail label="Z-Score" value={stdData.zScore} />
                    <Detail label="Medium" value={stdData.medium} />
                    <Detail label="Address 1" value={stdData.address1} />
                    <Detail label="Address 2" value={stdData.address2} />
                    <Detail label="Address 3" value={stdData.address3} />
                    <Detail label="Full Address" value={stdData.fullAddress} />
                    <Detail label="Email" value={stdData.email} />
                    <Detail label="Phone 1" value={stdData.phone1} />
                    <Detail label="Phone 2" value={stdData.phone2} />
                    <Detail label="General English Marks" value={stdData.genEnglishMarks} />
                    <Detail label="Intake" value={stdData.intake} />
                    <Detail label="Date of Enrolment" value={new Date(stdData.dateOfEnrolment).toLocaleDateString()} />
                    <Detail label="Distance" value={stdData.distance + ' km'} />
                    <Detail label="Assigned" value={stdData.isAssign ? 'Yes' : 'No'} />
                </div>
            ) : (
                <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4 text-sm">
                    {[ // Editable fields
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
