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
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
            <h1 className="font-bold text-emerald-600 text-xl">View Hostel : { }</h1>
        </div>
    )
}

export default ViewHostel