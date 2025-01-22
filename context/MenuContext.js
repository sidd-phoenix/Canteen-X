import { createContext, useContext, useState } from "react";

const MenuContext=createContext();

export const useSubMenu = () =>{
    const context=useContext(MenuContext);

    if(!context){
        throw new Error('useSubMenu must be used within a MenuProvider');
    }
    return context;
}

export const MenuProvider = ({children}) =>{
    const [subMenu, setSubMenu]=useState('default'); //Default view

    const value={
        subMenu,
        setSubMenu
    }

    return(
        <MenuContext.Provider value={value}>
            {children}
        </MenuContext.Provider>
    )
}