import React, { useEffect, useState } from 'react';
import axios from 'axios';
import localStorage from 'react-secure-storage';
import { getUserInfoFromToken } from '../../utils/auth';

const WardenRoomAssignNeed = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSpecialNeedsStudents = async () => {
            const userInfo = getUserInfoFromToken();

            if (!userInfo) {
                setError('Unauthorized. Please login.');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('login');
            if (!token) {
                setError('Unauthorized. Please login.');
                setLoading(false);
                return;
            }

            // Log current user email before sending request
            console.log('Current logged-in user email:', userInfo.email);

            try {
                // Pass email as query param (or adapt to backend)
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_API}/room/student-assign-need/${userInfo.email}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log('Fetched students:', res.data.students);

                if (Array.isArray(res.data.students)) {
                    setStudents(res.data.students);
                    setError(null);
                } else {
                    setStudents([]);
                    setError(res.data.message || 'No data found.');
                }
            } catch (err) {
                console.error('Failed to fetch special needs students:', err);
                setError('Unable to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialNeedsStudents();
    }, []); // Run once on mount

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500 animate-pulse">Loading...</div>
        );
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Students with Special Needs</h2>

            {students.length === 0 ? (
                <p className="text-gray-600">No students with special needs found for your hostel.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {students.map((entry, idx) => (
                        <div key={idx} className="bg-white shadow rounded-xl p-4 border">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                {entry.student?.name || 'Unknown Student'}
                            </h3>
                            <p>
                                <strong>Reg No:</strong> {entry.regNo}
                            </p>
                            <p>
                                <strong>Faculty:</strong> {entry.student?.faculty || 'N/A'}
                            </p>
                            <p>
                                <strong>Course:</strong> {entry.student?.course || 'N/A'}
                            </p>
                            <p>
                                <strong>Needs:</strong> {entry.needs}
                            </p>
                            <p>
                                <strong>Status:</strong>{' '}
                                <span className={entry.isAccpeted ? 'text-green-600' : 'text-yellow-600'}>
                                    {entry.isAccpeted ? 'Accepted' : 'Pending'}
                                </span>
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Submitted on:{' '}
                                {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WardenRoomAssignNeed;
