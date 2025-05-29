import React from 'react'
import { MdError } from "react-icons/md";

const DashError = () => {
    return (
        <div className='pt-8'>
            <center>
                <MdError className='h-16 w-auto fill-gray-500' />

                <h1 className="pt-4 text-3xl font-semibold text-gray-500 uppercase">503 Service Unavailable</h1>

                <p className="pt-4 text-gray-600">Server is temporarily unable to handle a client's request/ Page is Under Development</p>
            </center>

        </div>
    )
}

export default DashError