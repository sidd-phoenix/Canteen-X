import React from 'react'
import { useSubMenu } from '../context/MenuContext'

const MenuButtons = () => {
    const { setSubMenu } = useSubMenu()

    return (
        <div className='menu-sub'>
            <button onClick={() => setSubMenu('add_items')}>
                Add Items
            </button>
            <button onClick={() => setSubMenu('modify_items')}>
                Modify Items
            </button>
        </div>
    )
}

export default MenuButtons