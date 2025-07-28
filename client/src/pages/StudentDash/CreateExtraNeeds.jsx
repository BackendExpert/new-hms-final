import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import TextAreaInput from '../../components/Form/TextAreaInput'
import { getUserInfoFromToken } from '../../utils/auth' 

import { replace, useNavigate } from 'react-router-dom'

const CreateExtraNeeds = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        regNo: '',
        needs: '',
    })

    const token = localStorage.getItem('login')

    useEffect(() => {
        const userInfo = getUserInfoFromToken()
        if (userInfo && userInfo.email) {
            setFormData((prev) => ({
                ...prev,
                regNo: userInfo.email,
            }))
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)
        try {
            const res = await axios.post(import.meta.env.VITE_APP_API + '/student/student-create-needs', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if(res.data.Status === "Success"){
                alert(res.data.Message)
                navigate('/Dashboard/ExtraNeeds', { replace: true })
            }
            else{
                alert(res.data.Error)
            }
        } catch (error) {
            console.error('Error submitting special needs:', error)
            alert('Failed to submit special needs')
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-emerald-700 mb-6">Special Needs / Extra Requirements</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <TextAreaInput
                        label="Special Needs / Requests"
                        name="needs"
                        value={formData.needs}
                        onChange={handleChange}
                        placeholder="Describe any special needs or requirements..."
                        required
                        rows={5}
                    />
                </div>

                <input type="hidden" name="regNo" value={formData.regNo} />

                <div className="col-span-full flex justify-end mt-2">
                    <DefaultBtn type="submit" label="Submit Special Needs" />
                </div>
            </form>
        </div>
    )
}

export default CreateExtraNeeds
