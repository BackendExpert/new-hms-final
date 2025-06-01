import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import DefaultInput from '../../components/Form/DefaultInput';
import Dropdown from '../../components/Form/Dropdown';
import DefaultBtn from '../../components/Buttons/DefaultBtn';

const CreateHostel = () => {
    const navigate = useNavigate();
    const token = secureLocalStorage.getItem('login');

    const [wardendata, setwardendata] = useState([]);
    const [hosteldata, sethosteldata] = useState({
        hostelID: '',
        name: '',
        location: '',
        gender: '',
        roomCount: '',
        warden: ''
    });

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_API}/hostel/get-all-warden`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                if (res.data?.result) {
                    setwardendata(res.data.result);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        sethosteldata(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateHostel = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API}/hostel/Create-new-hostel`, hosteldata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (res.data.Status === "Success") {
                alert(res.data.Message);
                navigate('/Dashboard/Hostels', { replace: true });
            } else {
                alert(res.data.Error || "An error occurred");
            }
        } catch (err) {
            console.error(err);
            alert("Error occurred while creating hostel.");
        }
    };

    return (
        <div className="mx-auto p-6 bg-white rounded-xl shadow-md mt-2">
            <h1 className="font-bold text-emerald-600 text-xl">Create New Hostel</h1>

            <Link to={'/Dashboard/Hostels'}>
                <DefaultBtn type="button" label="Back" />
            </Link>

            <form onSubmit={handleCreateHostel} method="post">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                    <DefaultInput
                        label="Hostel ID"
                        name="hostelID"
                        value={hosteldata.hostelID}
                        onChange={handleInputChange}
                        required
                        placeholder="Hostel ID"
                    />

                    <DefaultInput
                        label="Hostel Name"
                        name="name"
                        value={hosteldata.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Hostel Name"
                    />

                    <DefaultInput
                        label="Hostel Location"
                        name="location"
                        value={hosteldata.location}
                        onChange={handleInputChange}
                        required
                        placeholder="Hostel Location (Enter Google Map Location)"
                    />

                    <Dropdown
                        label="Hostel Gender"
                        name="gender"
                        value={hosteldata.gender}
                        onChange={handleInputChange}
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' }
                        ]}
                        required
                    />

                    <DefaultInput
                        label="Number of Rooms"
                        type="number"
                        name="roomCount"
                        value={hosteldata.roomCount}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Number of Rooms"
                    />

                    <Dropdown
                        label="Assign Warden"
                        name="warden"
                        value={hosteldata.warden}
                        onChange={handleInputChange}
                        options={wardendata.map(w => ({
                            value: w._id,
                            label: `${w.username} - ${w.email}`
                        }))}
                        required
                    />

                    <div className="-mt-8">
                        <DefaultBtn type="submit" label="Create New Hostel" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateHostel;
