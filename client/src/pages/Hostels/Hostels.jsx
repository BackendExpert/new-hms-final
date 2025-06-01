import React from 'react'
import HostelData from './HostelData'

const Hostels = () => {
    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Manage Hostels</h1>
            <div className="">
                <HostelData />
            </div>
        </div>
    )
}

export default Hostels