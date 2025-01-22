import React from 'react'
import { MdRestaurantMenu } from 'react-icons/md'
import { useView } from '@/context/ViewContext'

const Sidebar_admin = () => {

    const { setView } = useView();


    return (
        <div className="sidebar">
            <button onClick={() => setView('menu')}>
                Menu
            </button>
            <button onClick={() => setView('addordertaker')}>
                Add Order Taker
            </button>
            <button onClick={() => setView('removeordertaker')}>
                Remove Order Taker
            </button>
        </div>
    )
}

export default Sidebar_admin