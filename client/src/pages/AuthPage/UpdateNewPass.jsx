import React, { useState } from 'react';
import axios from 'axios';
import DefaultInput from '../../components/Form/DefaultInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import { useNavigate } from 'react-router-dom';
import uopLogo from '../../assets/uoplogo.png';

const UpdateNewPass = () => {
    const [newPassData, setNewPassData] = useState({ email: '', newpass: '', confirmpass: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPassData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassData.newpass !== newPassData.confirmpass) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API}/auth/update-password`, newPassData);
            if (res.data.Status === 'Success') {
                alert(res.data.Message);
                navigate('/signin');
            } else {
                setError(res.data.Error || 'Failed to update password');
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col">
            <div className="flex flex-col md:items-center md:justify-center flex-grow">
                <img src={uopLogo} alt="University Logo" className="md:h-32 w-auto mb-6 mx-auto" />
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Update Password</h2>
                    <form onSubmit={handleSubmit}>
                        <DefaultInput
                            label="Email"
                            type="email"
                            name="email"
                            value={newPassData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            required
                        />
                        <DefaultInput
                            label="New Password"
                            type="password"
                            name="newpass"
                            value={newPassData.newpass}
                            onChange={handleInputChange}
                            placeholder="Enter new password"
                            required
                        />
                        <DefaultInput
                            label="Confirm Password"
                            type="password"
                            name="confirmpass"
                            value={newPassData.confirmpass}
                            onChange={handleInputChange}
                            placeholder="Confirm new password"
                            required
                        />
                        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
                        <DefaultBtn type="submit" label={loading ? 'Updating...' : 'Update Password'} disabled={loading} />
                    </form>
                </div>
            </div>

            <footer className="text-center text-sm text-gray-600 mt-10">
                &copy; {new Date().getFullYear()} University of Peradeniya | Hostel Management System
            </footer>
        </div>
    );
};

export default UpdateNewPass;
