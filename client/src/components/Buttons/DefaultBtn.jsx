import React from 'react'

const DefaultBtn = ({ label = "Click the Button", onClick, type = "button", disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`mt-6 px-6 py-2 rounded-md transition text-white 
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}
      `}
        >
            {label}
        </button>
    )
}

export default DefaultBtn