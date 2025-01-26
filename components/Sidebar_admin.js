import React from 'react'
import { MdRestaurantMenu, MdAdd, MdRemove } from 'react-icons/md'
import { useView } from '@/context/ViewContext'

const Sidebar_admin = () => {

    const { setView } = useView();


    return (
        <div className="sidebar">
            <button onClick={() => setView('menu')}>
                <MdRestaurantMenu />
            </button>
            <button onClick={() => setView('addordertaker')}>
                <MdAdd />
            </button>
            <button onClick={() => setView('removeordertaker')}>
                <MdRemove />
            </button>
        </div>
    )
}

export default Sidebar_admin