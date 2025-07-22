import React, { useEffect } from 'react'
import { getUserInfoFromToken } from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';
import DefaultBtn from '../../components/Buttons/DefaultBtn';

const AlreadyAssigned = () => {
    const navigate = useNavigate()
    const { username, roles } = getUserInfoFromToken() || {};
    const token = localStorage.getItem('login');

    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    if (!(roleNames.includes('admin') || roleNames.includes('director') || roleNames.includes('warden'))) {
        useEffect(() => {
            localStorage.clear()
            navigate('/', { replace: true })
        }, [])
    }

    return (
        <div>
            <div className="-mt-4 mb-2">
                <Link to={'/Dashboard/WardenStudents'}>
                    <DefaultBtn type='button' label='Back' />
                </Link>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-emerald-600">Already Assgin Students</h2>
            </div>
        </div>
    )
}

export default AlreadyAssigned