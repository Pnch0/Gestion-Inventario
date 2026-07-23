import React from "react";
import { useState, useEffect } from "react";
import { userService } from "../../Services/api.js";
import '../../Pages/Users/UsersPage.css';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editTarget, setEditTarget] = useState(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const toastStyles = {
        exito: {
            duration: 4000,
            position: 'top-center',
            style: {
                border: '1px solid #BBF7D0',
                padding: '16px',
                color: '#166534',
                background: '#EDFCF2',
            },
            iconTheme: {
                primary: '#15803D',
                secondary: '#EDFCF2',
            },
        },
        error: {
            duration: 4000,
            position: 'top-center',
            style: {
                border: '1px solid #FECDD3',
                padding: '16px',
                color: '#991B1B',
                background: '#FFF1F2',
            },
            iconTheme: {
                primary: '#991B1B',
                secondary: '#FFF1F2',
            },
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            setError(error.message);
            toast.error(`Error al cargar usuarios: ${error.message}`, toastStyles.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (idAuth) => {
        setUsuarioSeleccionadoId(idAuth);
        setMostrarConfirmacion(true);
    };

    const ejecutarEliminacion = async () => {
        if (!usuarioSeleccionadoId) return;
        setMostrarConfirmacion(false);

        try {
            await userService.deleteUser(usuarioSeleccionadoId);
            setUsers(users.filter(user => user.id_auth !== usuarioSeleccionadoId));
            toast.success('El usuario ha sido removido con éxito.', toastStyles.exito);
        } catch (error) {
            toast.error(error.message || 'No se pudo eliminar el usuario.', toastStyles.error);
        } finally {
            setUsuarioSeleccionadoId(null);
        }
    };


    const handleAction = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            await userService.updateUser(editTarget.id_auth, editTarget);         
            setEditTarget(null);
            
            toast.success('¡Los datos se han actualizado correctamente!', toastStyles.exito);
            fetchUsers();
        } catch (error) {
            toast.error(error.message || 'No se pudieron guardar los cambios.', toastStyles.error);
        } finally {
            setEnviando(false);
        }
    };
    
    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <>
        <Toaster />

        <div className="UserList-Contenedor">
            {users.length === 0 ? (
                <p>No hay usuarios registrados</p>
            ) : (
                <ul className="ListaDatos-Usuarios">
                    {users.map((user) => (
                        <li key={user.id_auth} className="Fila-Usuario">
                            <span>{user.rut}</span>
                            <span>{user.nombre}</span>
                            <span>{user.apellido}</span>
                            <span>{user.nombre_rol}</span>
                            <span>{user.correo}</span>
                            <span>{user.telefono}</span>
                            <div className="Acciones-Botones">
                                <button type="button" onClick={() => setEditTarget(user)}>
                                    <FaEdit className="Icono-Acciones"/>
                                </button>
                                <button type="button" onClick={() => handleDelete(user.id_auth)}>
                                    <FaTrashAlt className="Icono-Acciones"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>


        {editTarget && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <form className="Formulario-Crear-Usuario" onSubmit={handleAction}>
                        <h2>Editar Usuario</h2>
                        <h3>Editando a: {editTarget.nombre} {editTarget.apellido}</h3>
                        
                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="Nombre">Nombre:</label>
                            <input
                                id="Nombre"
                                value={editTarget.nombre || ''}
                                onChange={(e) => setEditTarget({ ...editTarget, nombre: e.target.value })}
                                placeholder="Nombre"
                                required
                            />
                        </div>

                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="Apellido">Apellido:</label>
                            <input
                                id="Apellido"
                                value={editTarget.apellido || ''}
                                onChange={(e) => setEditTarget({ ...editTarget, apellido: e.target.value })}
                                placeholder="Apellido"
                                required
                            />
                        </div>

                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="Correo">Correo:</label>
                            <input
                                id="Correo"
                                type="email"
                                value={editTarget.correo || ''}
                                onChange={(e) => setEditTarget({ ...editTarget, correo: e.target.value })}
                                placeholder="Correo"
                                required
                            />
                        </div>

                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="Telefono">Teléfono:</label>
                            <input
                                id="Telefono"
                                value={editTarget.telefono || ''}
                                onChange={(e) => setEditTarget({ ...editTarget, telefono: e.target.value })}
                                placeholder="Teléfono"
                            />
                        </div>

                        <div className="Fila-Doble">
                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="Rol">Rol:</label>
                                <select
                                    id="Rol"
                                    value={editTarget.rol_id || ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, rol_id: parseInt(e.target.value) })}
                                >
                                    <option value="" disabled>Seleccione un Rol</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Vendedor</option>
                                    <option value="3">Bodega</option>
                                </select>
                            </div>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="RUT">RUT:</label>
                                <input
                                    id="RUT"
                                    value={editTarget.rut || ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, rut: e.target.value })}
                                    placeholder="RUT usuario"
                                    required
                                />
                            </div>
                        </div>

                        <div className="Botones-Modal">
                            <button 
                                type="button" 
                                className="Boton-Cancelar" 
                                onClick={() => setEditTarget(null)}
                                disabled={enviando}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="Boton-Guardar"
                                disabled={enviando}
                            >
                                {enviando ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {mostrarConfirmacion && (
            <div className="Modal-Overlay-Alerta" style={{ zIndex: 10000 }}>
                <div className="Modal-Contenedor-Peligro peligro">
                    <div className="Modal-Header-Alerta">
                        <h3>¿Eliminar este usuario?</h3>
                        <button type="button" className="Modal-Cerrar-Alerta" onClick={() => setMostrarConfirmacion(false)}>&times;</button>
                    </div>
                    <div className="Modal-Cuerpo-Alerta">
                        <p>Esta acción removerá la cuenta del usuario de forma permanente. No podrás deshacer este cambio.</p>
                    </div>
                    <div className="Modal-Footer-Alerta doble-boton">
                        <button type="button" className="Modal-Boton-Cancelar-Alerta" onClick={() => setMostrarConfirmacion(false)}>
                            Cancelar
                        </button>
                        <button type="button" className="Modal-Boton-Confirmar-Alerta" onClick={ejecutarEliminacion}>
                            Sí, eliminar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default UserList;