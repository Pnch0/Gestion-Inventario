import './UsersPage.css';
import { useState } from 'react';
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import UserList from '../../Components/Users/UserList.jsx';
import { userService } from '../../Services/api.js';
import toast from 'react-hot-toast';

function UsersPage(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [formData, setFormData] = useState({
        rut: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        rol_id: '',
        contraseña: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'rol_id' ? parseInt(value) || '' : value
        }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            await userService.createUser(formData);
            toast.success('Usuario creado con éxito');
            
            setIsModalOpen(false);
            setFormData({
                rut: '', nombre: '', apellido: '', correo: '',
                telefono: '', rol_id: '', contraseña: ''
            });

            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            toast.error(error.message || 'Error al registrar al usuario');
        } finally {
            setEnviando(false);
        }
    };

    return(
        <>
        <div className="Contenedor-UsersPage">
            <div className="ContenedorSuperior-UsersPage">
                <button 
                    className='Boton-Funcion'
                    onClick={() => setIsModalOpen(true)}
                >
                    Agregar Usuario
                </button>
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

                        <select className='Select-FiltroUsuarios'>
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
                    <UserList refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>


        {isModalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <form className="Formulario-Crear-Usuario" onSubmit={handleCreateUser}>
                        <h2>Agregar Nuevo Usuario</h2>

                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="rut">RUT:</label>
                            <input
                                id="rut"
                                value={formData.rut}
                                onChange={handleChange}
                                placeholder="12345678-9"
                                required
                            />
                        </div>

                        <div className="Fila-Doble">
                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    required
                                />
                            </div>
                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="apellido">Apellido:</label>
                                <input
                                    id="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="Apellido"
                                    required
                                />
                            </div>
                        </div>

                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="correo">Correo:</label>
                            <input
                                id="correo"
                                type="email"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="contraseña">Contraseña:</label>
                            <input
                                id="contraseña"
                                type="password"
                                value={formData.contraseña}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="Fila-Doble">
                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="rol_id">Rol:</label>
                                <select
                                    id="rol_id"
                                    value={formData.rol_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Seleccione un Rol</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Vendedor</option>
                                    <option value="3">Bodega</option>
                                </select>
                            </div>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="telefono">Teléfono:</label>
                                <input
                                    id="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="+56 9 1234 5678"
                                />
                            </div>
                        </div>

                        <div className="Botones-Modal">
                            <button 
                                type="button" 
                                className="Boton-Cancelar" 
                                onClick={() => setIsModalOpen(false)}
                                disabled={enviando}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="Boton-Guardar"
                                disabled={enviando}
                            >
                                {enviando ? 'Guardando...' : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    )
}

export default UsersPage;