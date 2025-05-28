import React from 'react'

const DashFooter = () => {
    const currentyear = new Date().getFullYear()
    return (
        <div className='pl-4 py-4 border-t border-gray-100 bg-white md:flex justify-between items-center pr-4 text-sm text-slate-500'>
            <h1>
                <span className='font-semibold text-slate-700'>© {currentyear}</span>. All Rights Reserved. |
                Engineered by
                <a href="https://blackalphalabs.com" target='_blank' className='text-emerald-500 font-medium ml-1 hover:underline'>BLACK ALPHA LABS</a>
            </h1>
            <p className="text-gray-400 mt-2 md:mt-0">version 1.0</p>
        </div>


    )
}

export default DashFooter