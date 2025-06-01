import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import DefaultInput from '../../components/Form/DefaultInput';
import Dropdown from '../../components/Form/Dropdown';
import DefaultBtn from '../../components/Buttons/DefaultBtn';

const CreateHostel = () => {
    const navigate = useNavigate()
    const token = secureLocalStorage.getItem('login')
    const [hosteldata, sethosteldata] = useState({
        hostelID: '',
        name: '',
        location: '',
        gender: '',
        roomCount: '',
        warden: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        sethosteldata(prev => ({ ...prev, [name]: value }));
    };

    const headleCreateHostel = async (e) => {
        try {
            const res = await axios.post(import.meta.env.VITE_APP_API + '/hostel/Create-new-hostel', hosteldata, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            if (res.data.Status === "Success") {
                alert(res.data.Message)
                navigate('/Dashboard/Hostels', { replace: true })
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
        <div className='mx-auto p-6 bg-white rounded-xl shadow-md mt-2'>
            <h1 className="font-bold text-emerald-600 text-xl">Create New Hostel</h1>

            <Link to={'/Dashboard/Hostels'}>
                <DefaultBtn
                    type='button'
                    label='Back'
                />
            </Link>

            <form onSubmit={headleCreateHostel} method="post">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                    <DefaultInput
                        label={"Hostel Name"}
                        name={'name'}
                        value={hosteldata.name}
                        onChange={handleInputChange}
                        required
                        placeholder={"Hostel Name"}
                    />

                    <DefaultInput
                        label={"Hostel Location"}
                        name={'location'}
                        value={hosteldata.location}
                        onChange={handleInputChange}
                        required
                        placeholder={"Hostel Location (Enter Google Map Location)"}
                    />

                    <Dropdown
                        label="Hostel Type"
                        name="type"
                        value={hosteldata.type}
                        onChange={handleInputChange}
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' }
                        ]}
                        required
                    />

                    <DefaultInput
                        label={"Hostel Rooms"}
                        type='number'
                        name={'roomCount'}
                        value={hosteldata.roomCount}
                        onChange={handleInputChange}
                        required
                        placeholder={"Enter Number of Rooms"}
                    />


                    <div className="-mt-8">
                        <DefaultBtn
                            type='button'
                            label='Create New Hostel'
                        />
                    </div>

                </div>
            </form>
        </div>
    )
}

export default CreateHostel