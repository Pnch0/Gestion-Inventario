import './UsersPage.css';
import { useState, useEffect } from 'react';
import { FaRegUserCircle, FaSearch  } from "react-icons/fa";
import CreateUser from '../../Components/Users/CreateUser.jsx';
import UserList from '../../Components/Users/UserList.jsx';

function UsersPage(){

    return(
        <>
        <div className="Contenedor-UsersPage">
            <div className="ContenedorSuperior-UsersPage">
                <button className='Boton-Funcion'>Agregar Usuario</button>
                <button className='Boton-Usuario'><FaRegUserCircle className='Icono-Perfil'/></button>
            </div>

            <div className="ContenedorListado-UsersPage">
                <div className="ContenedorSuperior-ListadoUsuarios">
                    <div className="ContenedorSuperior-IzquierdaUsuarios">
                        <h2>Listado Usuarios</h2>
                    </div>
                    <div className="ContenedorSuperior-DerechaUsuarios">

                        <div className="Buscador-Usuarios">
                            <FaSearch className="Icono-Buscador" />
                            <input type="text" placeholder="Buscar usuario..." />
                        </div>

                        <select 
                        className='Select-FiltroUsuarios'
                        >
                            <option value="Todos">Todos los roles</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Vendedor">Vendedor</option>
                            <option value="Bodega">Bodega</option>
                        </select>
                    </div>
                </div>
                <div className="ContenedorEncabezado-ListadoUsuarios">
                    <ul>
                        <li>RUT</li>
                        <li>Nombre</li>
                        <li>Apellido</li>
                        <li>Rol</li>
                        <li>Correo</li>
                        <li>Telefono</li>
                        <li>Acciones</li>
                    </ul>
                </div>
                <div className="Contenedor-ListadoUsuarios">
                    <UserList />
                </div>
            </div>
        </div>
        
        </>
    )
}

export default UsersPage;
