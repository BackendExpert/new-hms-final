import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import FileInput from '../../components/Form/FileInput';
import DefaultBtn from '../../components/Buttons/DefaultBtn';


const StdCreateSheet = () => {
    const navigate = useNavigate();
    const token = secureLocalStorage.getItem('login');

    const [sheet, setsheet] = useState({
        file: null
    });

    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setsheet((prevData) => ({
                ...prevData,
                file: file,
            }));
        }
    };

    const headleUploadSheet = async () => {
        if (!sheet.file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', sheet.file);

        setLoading(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_APP_API}/student/create-student-sheet`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (res.data.Status === "Success") {
                alert(res.data.Message);
                navigate('/Dashboard/Students');
            } else {
                alert(res.data.Error);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while uploading the sheet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 mx-auto bg-white rounded-xl shadow-md">
            <div className="-mt-4 mb-4">
                <Link to={'/Dashboard/Students'}>
                    <DefaultBtn
                        type='button'
                        label='Back'
                    />
                </Link>
            </div>
            <h1 className="font-bold text-emerald-600 text-xl mb-4">Upload Student Sheet</h1>
            <FileInput
                label="Select Excel File"
                name="studentSheet"
                onChange={handleImageChange}
                accept=".xlsx,.xls"
                required
            />

            <button
                onClick={headleUploadSheet}
                disabled={loading}
                className="mt-3 w-full px-4 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 transition disabled:opacity-50"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Uploading...
                    </span>
                ) : (
                    'Upload Sheet'
                )}
            </button>
        </div>
    );
};

export default StdCreateSheet;
