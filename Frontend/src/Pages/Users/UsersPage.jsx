import './UsersPage.css';
import { useState } from 'react';
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import CreateUser from '../../Components/Users/CreateUser.jsx';
import UserList from '../../Components/Users/UserList.jsx';

function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('Todos');

    const handleUserCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            <div className="Contenedor-UsersPage">
                <div className="ContenedorSuperior-UsersPage">
                    <button 
                        className='Boton-Funcion'
                        onClick={() => setIsModalOpen(true)}
                    >
                        Agregar Usuario
                    </button>
                    <button className='Boton-Usuario'>
                        <FaRegUserCircle className='Icono-Perfil'/>
                    </button>
                </div>

                <div className="ContenedorListado-UsersPage">
                    <div className="ContenedorSuperior-ListadoUsuarios">
                        <div className="ContenedorSuperior-IzquierdaUsuarios">
                            <h2>Listado Usuarios</h2>
                        </div>
                        <div className="ContenedorSuperior-DerechaUsuarios">
                            <div className="Buscador-Usuarios">
                                <FaSearch className="Icono-Buscador" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar usuario..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select 
                                className='Select-FiltroUsuarios'
                                value={filterCriteria}
                                onChange={(e) => setFilterCriteria(e.target.value)}
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
                        <UserList 
                            refreshTrigger={refreshTrigger}
                            searchTerm={searchTerm}
                            filterCriteria={filterCriteria}
                        />
                    </div>
                </div>
            </div>

            <CreateUser 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserCreated={handleUserCreated}
            />
        </>
    );
}

export default UsersPage;