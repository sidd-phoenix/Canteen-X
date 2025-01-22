import React from 'react'
import { useSubMenu } from '@/context/MenuContext'
import AddItems from './AddItems'
import ModifyItems from './ModifyItems'

const MenuContent = () => {

    const { subMenu } = useSubMenu()

    return (
        <div className='menu-sub'>
            {subMenu == 'default' && (
                'Default Menu view'
            )}
            {subMenu == 'add_items' && (
                <AddItems />
            )}
            {subMenu == 'modify_items' && (
                <ModifyItems />
            )}
        </div>
    )
}

export default MenuContent