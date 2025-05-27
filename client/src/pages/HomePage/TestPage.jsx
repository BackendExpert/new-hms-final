import React, { useState } from 'react'
import DefaultInput from '../../components/Form/DefaultInput'
import DateInput from '../../components/Form/DateInput'
import Dropdown from '../../components/Form/Dropdown'
import FileInput from '../../components/Form/FileInput'
import TextAreaInput from '../../components/Form/TextAreaInput'
import DefaultBtn from '../../components/Buttons/DefaultBtn'

const TestPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        category: '',
        description: '',
        files: null,
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files : value,
        }))
    }

    return (
        <div className="max-w-2xl mx-auto my-20 px-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Form Components Demo</h2>

            <form action="" method="post">
                <DefaultInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                />

                <DefaultInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />

                <DateInput
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                />

                <Dropdown
                    label="Select Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    options={[
                        { label: 'Electronics', value: 'electronics' },
                        { label: 'Fashion', value: 'fashion' },
                        { label: 'Home & Garden', value: 'home-garden' },
                    ]}
                />

                <TextAreaInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write something..."
                    required
                />

                <FileInput
                    label="Upload Files"
                    name="files"
                    onChange={handleChange}
                    accept=".jpg,.png,.pdf"
                    multiple
                />

                <DefaultBtn type='submit' label="Submit sdas" />
            </form>
        </div>
    )
}

export default TestPage