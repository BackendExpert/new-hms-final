import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import DefaultInput from '../../components/Form/DefaultInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';

import uopLogo from '../../assets/uoplogo.png';

const SignIn = () => {
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showStudentGuide, setShowStudentGuide] = useState(false);
    const [showWardenGuide, setShowWardenGuide] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignInData((prev) => ({ ...prev, [name]: value }));
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

    const Modal = ({ title, content, onClose }) => (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-lg">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <div className="text-gray-700 mb-4">{content}</div>
                <div className="text-right">
                    <DefaultBtn type="button" label="Close" onClick={onClose} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:justify-center flex-grow">
                <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-10">
                    <img src={uopLogo} alt="University Logo" className="md:h-32 w-auto mb-4" />
                    <h1 className="text-lg text-center font-medium text-gray-800">
                        Welcome to Hostel Management System
                    </h1>
                    <h1 className="text-sm text-gray-700 mt-2">Read SignUp Guides</h1>
                    <div className="mt-2">
                        <DefaultBtn type="button" label="Read Student Guide" onClick={() => setShowStudentGuide(true)} />
                    </div>
                    <div className="mt-2">
                        <DefaultBtn type="button" label="Warden SignUp Guide" onClick={() => setShowWardenGuide(true)} />
                    </div>
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
                        <DefaultBtn type="submit" label={loading ? 'Signing In...' : 'Sign In'} disabled={loading} />
                    </form>

                    <div className="mt-4 space-y-1 text-sm text-center">
                        <p className="text-gray-800 hover:underline transition">
                            <a href="/Forgetpassword">Forgot password?</a>
                        </p>
                        <p className="text-gray-800 hover:underline transition">
                            <a href="/register">Create Account</a>
                        </p>
                    </div>
                </div>
            </div>

            <footer className="text-center text-sm text-gray-600 mt-10">
                &copy; {new Date().getFullYear()} University of Peradeniya | Hostel Management System
            </footer>

            {/* Student Guide Modal */}
            {showStudentGuide && (
                <Modal
                    title="Student Sign-Up Guide"
                    content={
                        <ul className="list-disc ml-5 space-y-2">
                            <li>wait for email to confram that your account is Created and Active.</li>
                            <li>if you got the email there are credentials to log in to system</li>
                            <li><span className='uppercase font-semibold'>important</span>: After Login with credentials please update the Password.</li>
                        </ul>
                    }
                    onClose={() => setShowStudentGuide(false)}
                />
            )}

            {/* Warden Guide Modal */}
            {showWardenGuide && (
                <Modal
                    title="Warden Sign-Up Guide"
                    content={
                        <ul className="list-disc ml-5 space-y-2">
                            <li>Sign up using official university credentials.</li>
                            <li>Then you goto Email Verify page if you not verify email at that stage you cannot verify email after</li>
                            <li>Your account will be verified by the admin.</li>
                            <li>Once approved, you can go to Dashboard.</li>
                        </ul>
                    }
                    onClose={() => setShowWardenGuide(false)}
                />
            )}
        </div>
    );
};

export default SignIn;
