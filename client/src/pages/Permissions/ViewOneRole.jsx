import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import DefaultInput from '../../components/Form/DefaultInput'
import DefaultBtn from '../../components/Buttons/DefaultBtn'

const ViewOneRole = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const token = secureLocalStorage.getItem('login')
    const [getonerole, setgetonerole] = useState({})

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/auth/view-one-role/' + id, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => {
                setgetonerole(res.data.Result);
            })
            .catch(err => console.log(err))
    }, [])

    const [detelepermission, setdetelepermission] = useState({
        roleId: id,
        permission: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setdetelepermission(prev => ({ ...prev, [name]: value }));
    };

    const headleDeletePermission = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(import.meta.env.VITE_APP_API + '/auth/delete-role-permission', detelepermission, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            if (res.data.Status === "Success") {
                alert("Permission Deleted Success")
                window.location.reload()
            }
            else {
                alert(res.data.Error)
            }
        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-4">
                    Role: <span className="uppercase">{getonerole?.name}</span>
                </h1>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Current User Role:</span>
                        <span className="font-semibold text-gray-900 uppercase">{getonerole?.name}</span>
                    </div>

                    <div>
                        <span className="block text-gray-700 font-medium mb-2">Current Role Permissions:</span>
                        <div className="flex flex-wrap gap-2">
                            {getonerole?.permissions?.length > 0 ? (
                                getonerole.permissions.map((perm, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full shadow-sm"
                                    >
                                        {perm}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 italic">No permissions assigned.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-sm text-gray-400">
                    <p>Created At: {new Date(getonerole?.createdAt).toLocaleString()}</p>
                    <p>Updated At: {new Date(getonerole?.updatedAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-4">
                <h1 className="text-xl font-bold text-emerald-600 mb-4">To Delete Permission from Role</h1>

                <form onSubmit={headleDeletePermission} method="post">
                    <DefaultInput
                        label="Permission"
                        type="text"
                        name="permission"
                        value={detelepermission.permission}
                        onChange={handleInputChange}
                        placeholder="Enter Permission to Delete"
                        required
                    />

                    <div className="-mt-4">
                        <DefaultBtn 
                            type='submit'
                            label='Delete Permission'
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ViewOneRole
