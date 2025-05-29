import React, { useState } from 'react'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import { Link, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'

const CreateRolePermissions = () => {
    const navigate = useNavigate()
    const token = secureLocalStorage.getItem('login')
    const [permissiondata, setpermissiondata] = useState({
        role: "",
        permission: "",
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setpermissiondata(prev => ({ ...prev, [name]: value }));
    };

    const headleCreatePermission = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(import.meta.env.VITE_APP_API + '/auth/create-permission', permissiondata, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            if(res.data.Status === "Success"){
                alert(res.data.Message)
                navigate('/Dashboard/Permissions', {replace: true })
            }
            else{
                alert(res.data.Error)
            }
        }
        catch (err) {
            console.log(err)
        }
    }


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