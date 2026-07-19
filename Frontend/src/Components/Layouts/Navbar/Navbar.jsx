import React from "react";
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { FaHome, FaShoppingBasket, FaUser} from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";



function Navbar(){

    return(
        <>
        <div className="Contenedor-Navbar">
            <div className="Contenedor-Links">
                <ul>
                    <li>
                        <NavLink to="/main-page" className="nav-item">
                            <FaHome className="Icono-Nav" />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/list-page" className="nav-item">
                            <CiBoxList className="Icono-Nav"/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/shop-page" className="nav-item">
                            <FaShoppingBasket className="Icono-Nav"/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/user-page" className="nav-item">
                            <FaUser className="Icono-Nav"/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings-page" className="nav-item">
                            <IoIosSettings className="Icono-Nav"/>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
        </>
    )
}

export default Navbar;