import React from "react";
import './Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingBasket, FaUser} from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { IoIosExit  } from "react-icons/io";
import { AuthService } from "../../../Services/api.js";



function Navbar(){
    const navigate = useNavigate();

    const handleLogout = async () =>{
        try{
            await AuthService.logout();

            localStorage.clear();
            sessionStorage.clear()

            navigate("/", { replace: true });
        
        } catch(error){
            console.error("Error al cerrar sesión: ", error.message)
        }
    };


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
                        <NavLink to="/sales-page" className="nav-item">
                            <FaShoppingBasket className="Icono-Nav"/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/users-page" className="nav-item">
                            <FaUser className="Icono-Nav"/>
                        </NavLink>
                    </li>
                    <li>
                        <button 
                            type="button" 
                            onClick={handleLogout} 
                            className="nav-item btn-logout"
                            title="Cerrar sesión"
                        >
                            <IoIosExit className="Icono-Nav"/>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        </>
    )
}

export default Navbar;