import React from 'react'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import { Link } from 'react-router-dom'


const CreateRolePermissions = () => {
    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Create Role and Permissions</h1>

            <Link to={'/Dashboard/Permissions'}>
                <DefaultBtn
                    type='button'
                    label='Back'
                />
            </Link>


        </div>
    )
}

export default CreateRolePermissions