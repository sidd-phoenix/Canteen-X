import React from 'react'
import { MdRestaurantMenu, MdAdd, MdRemove } from 'react-icons/md'
import { useView } from '@/context/ViewContext'

const Sidebar_admin = () => {

    const { setView } = useView();


    return (
        <div className="sidebar">
            <button onClick={() => setView('menu_admin')}>
                <MdRestaurantMenu />
            </button>
            <button onClick={() => setView('add_order_taker')}>
                <MdAdd />
            </button>
            <button onClick={() => setView('remove_order_taker')}>
                <MdRemove />
            </button>
        </div>
    )
}

export default Sidebar_admin