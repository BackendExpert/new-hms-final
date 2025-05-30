import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ViewOneRole = () => {
    const { id } = useParams()

    const [getoneuser, setgetoneuser] = useState([])

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/auth/view-one-role-permission/' + id, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(res => setgetoneuser(res.data.Result))
        .catch(err => console.log(err))        
    }, [])

    return (
        <div>
            <div className="">
                <h1 className=""></h1>
            </div>
        </div>
    )
}

export default ViewOneRole