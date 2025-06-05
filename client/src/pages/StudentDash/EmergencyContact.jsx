import React, { useState } from 'react'
import axios from 'axios'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import TextAreaInput from '../../components/Form/TextAreaInput'
import DefaultInput from '../../components/Form/DefaultInput'
import Dropdown from '../../components/Form/Dropdown'

const EmergencyContact = () => {
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
            const response = await axios.post('/api/emergency-contacts', {
                ...formData,
                active: formData.active === 'true' || formData.active === true,
            })
            alert('Emergency contact saved successfully!')
            console.log(response.data)
        } catch (error) {
            console.error('Error submitting emergency contact:', error)
            alert('Failed to save emergency contact')
        }
    }

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-emerald-700 mb-6">Emergency Contact</h1>
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
                    <DefaultBtn
                        type="submit"
                        label="Save Emergency Contact"
                    />
                </div>
            </form>
        </div>
    )
}

export default EmergencyContact
