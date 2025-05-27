import React from 'react'

const FileInput = ({ label, name, onChange, required = false, accept, multiple = false }) => {
    return (
        <div className="mb-5">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type="file"
                name={name}
                id={name}
                onChange={onChange}
                required={required}
                accept={accept}
                multiple={multiple}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md bg-white file:px-4 file:py-2 file:mr-4 file:border-0 file:bg-gray-100 file:text-gray-800 file:rounded-md hover:file:bg-gray-200 transition"
            />
        </div>
    )
}

export default FileInput