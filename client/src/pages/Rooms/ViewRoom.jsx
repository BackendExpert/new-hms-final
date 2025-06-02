import React from 'react'
import { Link, useParams } from 'react-router-dom'
import DefaultBtn from '../../components/Buttons/DefaultBtn'


const ViewRoom = () => {
    const {id} = useParams()
    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-5">
            <div className="-mt-4 mb-2">
                <Link to={'/Dashboard/Rooms'}>
                    <DefaultBtn type="button" label="Back" />
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-emerald-700 mb-4">Room Information: {id}</h1>
        </div>
    )
}

export default ViewRoom