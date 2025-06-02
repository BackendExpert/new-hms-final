import React from 'react'
import RoomData from './RoomData'
import AllRooms from './AllRooms'

const Rooms = () => {
    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Manage Rooms</h1>

            <div className="">
                <RoomData />
            </div>

            <div className="">
                <AllRooms />
            </div>

        </div>
    )
}

export default Rooms