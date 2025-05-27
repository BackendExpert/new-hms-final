import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import DefaultInput from '../../components/Form/DefaultInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';

import uopLogo from '../../assets/uoplogo.png';

const SignIn = () => {
    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignInData((prev) => ({
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
                `${import.meta.env.VITE_APP_API}/auth/signin`,
                signInData
            );

            if (res.data.Status === 'Success') {
                alert(res.data.Message);
                localStorage.setItem('login', res.data.Token);
                secureLocalStorage.setItem('loginE', res.data.Result.email);
                secureLocalStorage.setItem('loginU', res.data.Result.username);
                secureLocalStorage.setItem('loginR', res.data.Result.role);
                localStorage.setItem('dashmenuID', 1);
                navigate('/Dashboard/Home');
                window.location.reload();
            } else {
                setError(res.data.Error || 'Sign-in failed');
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 md:flex md:items-center md:justify-center">
            <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-10">
                <img src={uopLogo} alt="University Logo" className="md:h-32 w-auto mb-4" />
                <h1 className="text-lg text-center font-medium text-gray-800">
                    Welcome to Hostel Management System
                </h1>
                <h1 className="">Read Student SignUp Guide</h1>
                <a href="">
                    <DefaultBtn
                        type='button'
                        label='Read Student Guide'
                    />
                </a>
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <DefaultInput
                        label="Email"
                        type="email"
                        name="email"
                        value={signInData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                    />

                    <DefaultInput
                        label="Password"
                        type="password"
                        name="password"
                        value={signInData.password}
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
                        label={loading ? 'Signing In...' : 'Sign In'}
                        disabled={loading}
                    />
                </form>

                <div className="mt-4 space-y-1 text-sm text-center">
                    <p className="text-gray-800 hover:underline transition">
                        <a href="#">Forgot password?</a>
                    </p>
                    <p className="text-gray-800 hover:underline transition">
                        Student? <a href="#">Create Account</a>
                    </p>
                    <p className="text-gray-800 hover:underline transition">
                        <a href="#">Verify Student Email Address</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
