import React from 'react'
import { FaUser } from 'react-icons/fa'
import { useView } from '@/context/ViewContext'; // Import the context


const Sidebar_order_taker = () => {

    const { setView } = useView(); // Get the setSelectedView function from context


    return (
        <div className="sidebar">
            <button onClick={() => setView('user_profile')}>
                <FaUser />
            </button>
        </div>
    )
}

export default Sidebar_order_taker