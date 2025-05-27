import React, { useState } from 'react';
import axios from 'axios';
import DefaultInput from '../../components/Form/DefaultInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import { useNavigate } from 'react-router-dom';
import uopLogo from '../../assets/uoplogo.png';

const VerifyEmail = () => {
    const [emailData, setEmailData] = useState({ email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setEmailData({ email: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API}/auth/verify-email`, emailData);
            if (res.data.Status === 'Success') {
                alert(res.data.Message);
                navigate('/signin');
            } else {
                setError(res.data.Error || 'Email verification failed. You cannot verify later.');
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
                <img src={uopLogo} alt="University Logo" className="md:h-32 w-auto mb-4 mx-auto" />

                <p className="text-center text-gray-700 mb-6 max-w-md mx-auto">
                    Please verify your email now. If you cannot verify at this stage, you will not be able to verify later.
                </p>

                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Verify Email</h2>
                    <form onSubmit={handleSubmit}>
                        <DefaultInput
                            label="Email"
                            type="email"
                            name="email"
                            value={emailData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            required
                        />
                        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
                        <DefaultBtn type="submit" label={loading ? 'Verifying...' : 'Verify Email'} disabled={loading} />
                    </form>
                </div>
            </div>

            <footer className="text-center text-sm text-gray-600 mt-10">
                &copy; {new Date().getFullYear()} University of Peradeniya | Hostel Management System
            </footer>
        </div>
    );
};

export default VerifyEmail;
