import React, { useEffect } from 'react'
import { getUserInfoFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const AlreadyAssigned = () => {
    const navigate = useNavigate()
    const { username, roles } = getUserInfoFromToken() || {};
    const token = localStorage.getItem('login');

    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    if (!(roleNames.includes('admin') || roleNames.includes('director') || roleNames.includes('warden'))){
        useEffect(() => {
            localStorage.clear()
            navigate('/', { replace: true })
        }, [])
    }

    return (
        <div>AlreadyAssigned</div>
    )
}

export default AlreadyAssigned