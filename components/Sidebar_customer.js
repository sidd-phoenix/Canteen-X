import { useView } from '@/context/ViewContext'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory, faListAlt } from '@fortawesome/free-solid-svg-icons'
import '../styles/Sidebar.css'

const Sidebar_customer = () => {

    const { setView } = useView()

    return (
        <div className="sidebar">
            <button onClick={() => setView('order_history')} className="sidebar-button">
                <FontAwesomeIcon icon={faHistory} />
                {/* <h6>Order History</h6> */}
            </button>
            <button onClick={() => setView('active_orders')} className="sidebar-button">
                <FontAwesomeIcon icon={faListAlt} />
                {/* <h6>Active Orders</h6> */}
            </button>
        </div>
    )
}

export default Sidebar_customer