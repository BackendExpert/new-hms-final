import React, { useEffect, useState } from 'react'
import { getUserInfoFromToken } from '../../utils/auth';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const AssignStundetToRoomSp = () => {
    const { id } = useParams()
    const { username, roles } = getUserInfoFromToken() || {};
    const token = localStorage.getItem('login');

    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    const [getallrooms, setgetallrooms] = useState([])

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/warden/all-rooms', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => setgetallrooms(res.data.Result))
            .catch(err => console.log(err))
    }, [])

    if (roleNames.includes('admin') || roleNames.includes('director') || roleNames.includes('warden')) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Assign Stundet Room {id}</h2>
                <p className="text-gray-500 text-sm">(vie Special Needs)</p>
            </div>
        )
    }
}

export default AssignStundetToRoomSp