import React, { useEffect, useState } from 'react';
import DefaultBtn from '../../components/Buttons/DefaultBtn';
import { Link } from 'react-router-dom';
import { getUserInfoFromToken } from '../../utils/auth'; // adjust path
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const ExtraNeeds = () => {
    const [specialNeedsList, setSpecialNeedsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = secureLocalStorage.getItem('login');

    useEffect(() => {
        const fetchSpecialNeeds = async () => {
            const userInfo = getUserInfoFromToken();
            if (!userInfo?.email) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_API}/student/get-student-needs/${userInfo.email}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data && response.data.Data && Array.isArray(response.data.Data)) {
                    setSpecialNeedsList(response.data.Data);
                } else {
                    setSpecialNeedsList([]);
                }
            } catch (err) {
                console.error('Failed to fetch special needs:', err);
                setError('Failed to load special needs');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialNeeds();
    }, [token]);

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow">
            <h1 className="text-3xl font-bold text-emerald-700 mb-6">Extra Needs</h1>

            <div className="space-y-4 text-gray-800">
                <p className="text-xl font-semibold text-red-600 uppercase">Important</p>
                <p>Add your extra needs here.</p>
                <p>This will help you get a room according to your requirements.</p>
                <p>
                    Please note, the warden must approve your request for you to be assigned a room based on your needs.
                </p>
                <p>
                    If the warden does not approve your request, you will be assigned a room automatically like others.
                </p>
            </div>

            <div className="mt-8">
                {loading ? (
                    <p>Loading your special needs...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : specialNeedsList.length > 0 ? (
                    <div className="space-y-6 mb-6">
                        <h2 className="font-semibold text-emerald-700 mb-2">Your Submitted Special Needs:</h2>
                        {specialNeedsList.map((need) => (
                            <div
                                key={need._id}
                                className="bg-emerald-50 p-4 rounded border border-emerald-200"
                            >
                                <p>{need.needs}</p>
                                <p className="mt-2 text-sm text-gray-600">
                                    Status: {need.isAccpeted ? 'Approved' : 'Pending / Not Approved'}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Submitted on: {new Date(need.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have not submitted any special needs yet.</p>
                )}
            </div>

            <div className="mt-4">
                <Link to="/Dashboard/CreateExtraNeeds">
                    <DefaultBtn type="button" label="Add Your Requirements" />
                </Link>
            </div>
        </div>
    );
};

export default ExtraNeeds;
