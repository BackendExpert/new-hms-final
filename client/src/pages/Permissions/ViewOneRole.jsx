import React from 'react'
import { useParams } from 'react-router-dom'

const ViewOneRole = () => {
    const { id } = useParams()

    return (
        <div>ViewOneRole</div>
    )
}

export default ViewOneRole