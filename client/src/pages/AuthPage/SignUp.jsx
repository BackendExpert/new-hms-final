import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import DefaultInput from '../../components/Form/DefaultInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';

import uopLogo from '../../assets/uoplogo.png';

const SignUp = () => {
    const [signUpData, setSignUpData] = useState({
        staffNo: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignUpData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_APP_API}/auth/signup`,
                signUpData
            );

            if (res.data.Status === 'Success') {
                alert(res.data.Message);
                // Optionally store info or navigate
                navigate('/Dashboard/Home');
                window.location.reload();
            } else {
                setError(res.data.Error || 'Sign-up failed');
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-center flex-grow">
                <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-10">
                    <img src={uopLogo} alt="University Logo" className="md:h-32 w-auto mb-4" />
                    <h1 className="text-lg text-center font-medium text-gray-800">
                        Welcome to Hostel Management System
                    </h1>
                </div>

                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <DefaultInput
                            label="Staff Number"
                            type="text"
                            name="staffNo"
                            value={signUpData.staffNo}
                            onChange={handleInputChange}
                            placeholder="Enter your staff number"
                            required
                        />

                        <DefaultInput
                            label="Email"
                            type="email"
                            name="email"
                            value={signUpData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            required
                        />

                        <DefaultInput
                            label="Password"
                            type="password"
                            name="password"
                            value={signUpData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                        />

                        {error && (
                            <div className="mb-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <DefaultBtn
                            type="submit"
                            label={loading ? 'Signing Up...' : 'Sign Up'}
                            disabled={loading}
                        />
                    </form>

                    <div className="mt-4 space-y-1 text-sm text-center">
                        <p className="text-gray-800 hover:underline transition">
                            <a href="/">Already have an account? Sign In</a>
                        </p>
                    </div>
                </div>
            </div>

            <footer className="text-center text-sm text-gray-600 mt-10">
                &copy; {new Date().getFullYear()} University of Peradeniya | Hostel Management System
            </footer>
        </div>
    );
};

export default SignUp;
