import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import DefaultInput from '../../components/Form/DefaultInput'
import TextAreaInput from '../../components/Form/TextAreaInput'
import Dropdown from '../../components/Form/Dropdown'
import DateInput from '../../components/Form/DateInput'


const StdCreateManually = () => {
    const navigate = useNavigate()
    const token = secureLocalStorage.getItem('login')

    const [studentData, setStudentData] = useState({
        enrolmentNo: '',
        indexNo: '',
        name: '',
        title: '',
        lastName: '',
        initials: '',
        fullName: '',
        alDistrict: '',
        sex: '',
        zScore: '',
        medium: '',
        nic: '',
        address1: '',
        address2: '',
        address3: '',
        fullAddress: '',
        email: '',
        phone1: '',
        phone2: '',
        genEnglishMarks: '',
        intake: '',
        dateOfEnrolment: '',
        distance: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setStudentData(prev => ({ ...prev, [name]: value }))
    }

    const handleCreateStudent = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(
                import.meta.env.VITE_APP_API + '/student/create-student-manually',
                studentData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (res.data.message) {
                alert(res.data.message)
                navigate('/Dashboard/Students')
            } else {
                alert(res.data.error || 'An error occurred')
            }
        } catch (err) {
            console.log(err)
            alert("An unexpected error occurred.")
        }
    }

    return (
        <div className=" mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
            <h1 className="text-2xl font-semibold text-emerald-600 mb-6">Create Student Manually</h1>

            <form onSubmit={handleCreateStudent}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DefaultInput label="Enrolment No" name="enrolmentNo" value={studentData.enrolmentNo} onChange={handleInputChange} required />
                    <DefaultInput label="Index No" name="indexNo" value={studentData.indexNo} onChange={handleInputChange} required />
                    <DefaultInput label="Name" name="name" value={studentData.name} onChange={handleInputChange} />
                    <DefaultInput label="Title" name="title" value={studentData.title} onChange={handleInputChange} />
                    <DefaultInput label="Last Name" name="lastName" value={studentData.lastName} onChange={handleInputChange} />
                    <DefaultInput label="Initials" name="initials" value={studentData.initials} onChange={handleInputChange} />
                    <DefaultInput label="Full Name" name="fullName" value={studentData.fullName} onChange={handleInputChange} />
                    <DefaultInput label="A/L District" name="alDistrict" value={studentData.alDistrict} onChange={handleInputChange} />
                    <Dropdown
                        label="Sex"
                        name="sex"
                        value={studentData.sex}
                        onChange={handleInputChange}
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' }
                        ]}
                        required
                    />
                    <DefaultInput label="Z-Score" name="zScore" value={studentData.zScore} onChange={handleInputChange} />
                    <DefaultInput label="Medium" name="medium" value={studentData.medium} onChange={handleInputChange} />
                    <DefaultInput label="NIC" name="nic" value={studentData.nic} onChange={handleInputChange} required />
                    <DefaultInput label="Phone 1" name="phone1" value={studentData.phone1} onChange={handleInputChange} />
                    <DefaultInput label="Phone 2" name="phone2" value={studentData.phone2} onChange={handleInputChange} />
                    <DefaultInput label="Email" name="email" value={studentData.email} onChange={handleInputChange} />
                    <DefaultInput label="General English Marks" name="genEnglishMarks" value={studentData.genEnglishMarks} onChange={handleInputChange} />
                    <DefaultInput label="Intake" name="intake" value={studentData.intake} onChange={handleInputChange} />
                    <DefaultInput label="Distance" name="distance" value={studentData.distance} onChange={handleInputChange} />
                    <DateInput label="Date of Enrolment" name="dateOfEnrolment" value={studentData.dateOfEnrolment} onChange={handleInputChange} />
                </div>

                <TextAreaInput
                    label="Address Line 1"
                    name="address1"
                    value={studentData.address1}
                    onChange={handleInputChange}
                />
                <TextAreaInput
                    label="Address Line 2"
                    name="address2"
                    value={studentData.address2}
                    onChange={handleInputChange}
                />
                <TextAreaInput
                    label="Address Line 3"
                    name="address3"
                    value={studentData.address3}
                    onChange={handleInputChange}
                />
                <TextAreaInput
                    label="Full Address"
                    name="fullAddress"
                    value={studentData.fullAddress}
                    onChange={handleInputChange}
                />

                <div className="flex items-center justify-between mt-6">
                    <Link to="/Dashboard/Students">
                        <DefaultBtn type="button" label="Back" />
                    </Link>
                    <DefaultBtn type="submit" label="Create Student" />
                </div>
            </form>
        </div>
    )
}

export default StdCreateManually
