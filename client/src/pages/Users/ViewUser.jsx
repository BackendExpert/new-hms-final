import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'


const ViewUser = () => {
    const { id } = useParams()
    const token = secureLocalStorage.getItem('login')
    const [getoneuser, setgetoneuser] = useState({})

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/user/view-one-user/' + id, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => {
                setgetoneuser(res.data.Result);
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <div className="bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-4">
                    Current User: <span className="uppercase">{getoneuser?.email}</span>
                </h1>
            </div>
        </div>
    )
}

export default ViewUser