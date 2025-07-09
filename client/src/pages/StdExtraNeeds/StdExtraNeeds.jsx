import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StdExtraNeeds = () => {
    const [getextraneeds, setgetextraneeds] = useState([])

    useEffect(() => {
        axios.get(import.meta.env.VITE_APP_API + '/warden/std-extra-needs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => setgetextraneeds(res.data.Result))
        .catch(err => console.log(err))
    }, [])
    
    return (
        <div>StdExtraNeeds</div>
    )
}

export default StdExtraNeeds