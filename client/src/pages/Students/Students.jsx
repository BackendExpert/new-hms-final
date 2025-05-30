import React from 'react'
import { FaUserGraduate } from 'react-icons/fa6'
import StdData from './StdData'
import DefaultBtn from '../../components/Buttons/DefaultBtn'
import { Link } from 'react-router-dom'
import AllStudents from './AllStudents'

const Students = () => {
    return (
        <div>
            <h1 className="font-bold text-emerald-600 text-xl">Manage Students</h1>

            <div className="">
                <StdData />
            </div>

            <div className="-mt-6">
                <div className="md:flex">
                    <div className="">
                        <Link >
                            <DefaultBtn 
                                type='button'
                                label='Create Students (Upload Excel Sheet)'
                            />
                        </Link>
                    </div>
                    <div className="md:ml-4">
                        <Link >
                            <DefaultBtn 
                                type='button'
                                label='Create Student (Manually)'
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <AllStudents />
            </div>
        </div>
    )
}

export default Students