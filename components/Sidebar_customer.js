import { useView } from '@/context/ViewContext'
import React from 'react'
import { FaHistory } from 'react-icons/fa'


const Sidebar_customer = () => {

    const { setView } = useView()

    return (
        <div className="sidebar">
            <button onClick={() => setView('order_history')}>
                <FaHistory />
            </button>
        </div>
    )
}

export default Sidebar_customer