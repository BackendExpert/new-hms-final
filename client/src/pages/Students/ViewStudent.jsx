import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ViewStudent = () => {
    const { id } = useParams()

    const [stdData, sestdData] = useState([])

    const token = secureLocalStorage.getItem('login')

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/student/get-student-byID/' + id, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => sestdData(res.data.Result))
        .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Student:</h1>
        </div>
    )
}

export default ViewStudent