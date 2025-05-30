import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage'
import DefaultBtn from '../../components/Buttons/DefaultBtn'


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
                <div className="-mt-4 mb-2">
                    <Link to={'/Dashboard/Users'}>
                        <DefaultBtn
                            type='button'
                            label='Back'
                        />
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-emerald-600 mb-4">
                    Current User: <span className="">{getoneuser?.email}</span>
                </h1>

                <div className="mt-6 space-y-4">
                    <div className="">
                        <h1 className="block text-gray-700 font-medium">Username</h1>
                        <span
                            className="inline-block bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full shadow-sm"
                        >
                            {getoneuser?.username}
                        </span>
                    </div>

                    <div className="">
                        <h1 className="block text-gray-700 font-medium">Email</h1>
                        <span
                            className="inline-block bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full shadow-sm"
                        >
                            {getoneuser?.email}
                        </span>
                    </div>

                    <div className="">
                        <h1 className="block text-gray-700 font-medium">Active Roles</h1>
                        <span
                            className="inline-block bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full shadow-sm"
                        >
                            <div className="flex flex-wrap gap-2">
                                {getoneuser.roles?.length > 0 ? (
                                    getoneuser.roles.map((role, index) => (
                                        <span
                                            key={index}
                                            className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                                        >
                                            {typeof role === 'string' ? role : role.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic text-sm">No roles</span>
                                )}
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewUser