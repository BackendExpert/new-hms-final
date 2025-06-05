import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import DefaultInput from '../../components/Form/DefaultInput'
import { getUserInfoFromToken } from '../../utils/auth'
import localStorage from 'react-secure-storage'

const EmergencyContact = () => {
    const token = localStorage.getItem('login')

    const [formData, setFormData] = useState({
        regNo: '',
        firstName: '',
        surname: '',
        relationship: '',
        telNo: '',
        address: {
            houseNo: '',
            street: '',
            locality: '',
            city: '',
            postcode: ''
        },
        active: true
    })

    const [loading, setLoading] = useState(true)
    const [hasData, setHasData] = useState(false)

    // On mount, set regNo and fetch existing emergency contact data
    useEffect(() => {
        const userInfo = getUserInfoFromToken()
        if (userInfo?.email) {
            setFormData((prev) => ({
                ...prev,
                regNo: userInfo.email
            }))
            fetchEmergencyContact(userInfo.email)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchEmergencyContact = async (regNo) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API}/student/emergency-contact`,
                {
                    params: { regNo },
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            if (response.data && response.data.emergencyContact) {
                setHasData(true)
                setFormData((prev) => ({
                    ...prev,
                    ...response.data.emergencyContact,
                    address: {
                        ...prev.address,
                        ...response.data.emergencyContact.address
                    }
                }))
            } else {
                setHasData(false)
            }
        } catch (error) {
            console.error('Error fetching emergency contact:', error)
            setHasData(false)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1]
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                import.meta.env.VITE_APP_API + '/student/create-emergency-contact',
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (response.data.Status === 'Success') {
                alert(response.data.Message)
                window.location.reload()
            } else {
                alert(response.data.Error || 'Failed to save emergency contact')
            }
        } catch (error) {
            console.error('Error submitting emergency contact:', error)
            alert('Failed to save emergency contact')
        }
    }

    if (loading) return <div>Loading emergency contact information...</div>

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow space-y-8">
            <h1 className="text-2xl font-bold text-emerald-700">Emergency Contact</h1>

            {/* Display emergency contact info summary if exists */}
            {hasData ? (
                <div className="border border-emerald-300 rounded p-4 bg-emerald-50">
                    <h2 className="text-xl font-semibold mb-2">Current Emergency Contact Info</h2>
                    <p>
                        <strong>Name:</strong> {formData.firstName} {formData.surname}
                    </p>
                    <p>
                        <strong>Relationship:</strong> {formData.relationship}
                    </p>
                    <p>
                        <strong>Telephone:</strong> {formData.telNo}
                    </p>
                    <p>
                        <strong>Address:</strong>{' '}
                        {`${formData.address.houseNo}, ${formData.address.street}, ${formData.address.locality}, ${formData.address.city}, ${formData.address.postcode}`}
                    </p>
                </div>
            ) : (
                <p className="italic text-gray-500">No emergency contact info found. Please add below.</p>
            )}

            {/* Form for adding/updating */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DefaultInput
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Contact's First Name"
                    required
                />
                <DefaultInput
                    label="Surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Contact's Surname"
                    required
                />
                <DefaultInput
                    label="Relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    placeholder="e.g., Father, Mother, Guardian"
                    required
                />
                <DefaultInput
                    label="Telephone Number"
                    name="telNo"
                    value={formData.telNo}
                    onChange={handleChange}
                    placeholder="e.g., +94XXXXXXXXX"
                    required
                />
                <DefaultInput
                    label="House Number"
                    name="address.houseNo"
                    value={formData.address.houseNo}
                    onChange={handleChange}
                    placeholder="e.g., 123A"
                    required
                />
                <DefaultInput
                    label="Street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="e.g., Main Street"
                    required
                />
                <DefaultInput
                    label="Locality"
                    name="address.locality"
                    value={formData.address.locality}
                    onChange={handleChange}
                    placeholder="e.g., Suburb or Village"
                    required
                />
                <DefaultInput
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="e.g., Kandy"
                    required
                />
                <DefaultInput
                    label="Postcode"
                    name="address.postcode"
                    value={formData.address.postcode}
                    onChange={handleChange}
                    placeholder="e.g., 20000"
                    required
                />
                <div className="col-span-full flex justify-end mt-2">
                    <DefaultBtn type="submit" label="Save Emergency Contact" />
                </div>
            </form>
        </div>
    )
}

export default EmergencyContact
