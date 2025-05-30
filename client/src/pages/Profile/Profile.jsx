import React, { useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import DefaultInput from '../../components/Form/DefaultInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import DashUser from '../../assets/DashUser.png'
import secureLocalStorage from 'react-secure-storage';

const Profile = () => {
    const [btnClick, setBtnClick] = useState(false);
    const token = secureLocalStorage.getItem('login')

    const handleBtnClick = () => {
        setBtnClick(!btnClick);
    };

    const [updatepass, setupdatepass] = useState({
        currentpass: '',
        newpass: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setpermissiondata(prev => ({ ...prev, [name]: value }));
    };

    const healdeUpdatePass = (e) => {
        e.preventDefault();
        try {

        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-emerald-600 mb-8">My Profile</h1>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10 transition hover:shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Left Section: Avatar + Info */}
                    <div className="flex items-start gap-6">
                        <img
                            src={DashUser}
                            alt="Profile"
                            className="h-36 w-36 rounded-full border-4 border-emerald-600 shadow-md object-cover"
                        />
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-emerald-600 uppercase">Jehan</h2>
                            <p className="text-gray-600 text-base">jehnaa@123.com</p>
                            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm px-4 py-1 rounded-full font-medium shadow-sm">
                                Admin
                            </span>
                        </div>
                    </div>

                    {/* Right Section: Edit Button */}
                    <button
                        type="button"
                        onClick={handleBtnClick}
                        className="cursor-pointer flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-full shadow-sm transition"
                    >
                        <MdOutlineEdit className="text-lg" />
                        {btnClick ? 'Close' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Toggle Section */}
            {btnClick && (
                <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-2xl shadow-md transition">
                    <form onSubmit={healdeUpdatePass} method="post">
                        <DefaultInput
                            label="Current Password"
                            type="password"
                            name="currentpass"
                            value={updatepass.currentpass}
                            onChange={handleInputChange}
                            placeholder="*********"
                            required
                        />
                        <DefaultInput
                            label="New Password"
                            type="password"
                            name="newpass"
                            value={updatepass.newpass}
                            onChange={handleInputChange}
                            placeholder="*********"
                            required
                        />

                        <div className="-mt-4">
                            <DefaultBtn
                                type='submit'
                                label='Update Password'
                            />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile;
