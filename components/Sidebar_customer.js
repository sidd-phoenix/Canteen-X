import { useView } from '@/context/ViewContext'
import React from 'react'
// import { FaHistory } from 'react-icons/fa'


const Sidebar_customer = () => {

    const { setView } = useView()

    return (
        <div className="sidebar">
            <button onClick={() => setView('order_history')}>
                <h6>Order History</h6>
            </button>
            <button onClick={() => setView('active_orders')}>
                <h6>Active Orders</h6>
            </button>
        </div>
    )
}

export default Sidebar_customer