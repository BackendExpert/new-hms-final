import React from 'react'
import HostelData from './HostelData'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import { Link } from 'react-router-dom'
import AllHostelData from './AllHostelData'

const Hostels = () => {
    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Manage Hostels</h1>
            <div className="">
                <HostelData />
            </div>
            <div className="-mt-6">
                <div className="md:flex">
                    <div className="">
                        <Link to={'/Dashboard/Create-hostel'}>
                            <DefaultBtn
                                type='button'
                                label='Create New Hostel'
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <AllHostelData />
            </div>

        </div>
    )
}

export default Hostels