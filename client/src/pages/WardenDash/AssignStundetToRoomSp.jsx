import React from 'react'
import { getUserInfoFromToken } from '../../utils/auth';
import { useParams } from 'react-router-dom';

const AssignStundetToRoomSp = () => {
    const {id} = useParams()
    const { username, roles } = getUserInfoFromToken() || {};
    
    const roleNames = Array.isArray(roles)
        ? roles.map(r => (typeof r === 'string' ? r : r.name))
        : [typeof roles === 'string' ? roles : roles?.name];

    if (roleNames.includes('admin') || roleNames.includes('director') || roleNames.includes('warden')) {
        return (
            <div>AssignStundetToRoomSp {id}</div>
        )
    }
}

export default AssignStundetToRoomSp