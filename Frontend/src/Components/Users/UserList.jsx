import React from "react";
import { useState, useEffect } from "react";
import { userService } from "../../Services/api.js";
import '../../Pages/Users/UsersPage.css';
import { FaEdit, FaTrashAlt } from "react-icons/fa";

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editTarget, setEditTarget] = useState(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState(null);
    const [alertaResultado, setAlertaResultado] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Abre el modal de confirmación
    const handleDelete = (idAuth) => {
        setUsuarioSeleccionadoId(idAuth);
        setMostrarConfirmacion(true);
    };

    // Ejecuta la eliminación tras confirmar
    const ejecutarEliminacion = async () => {
        if (!usuarioSeleccionadoId) return;
        setMostrarConfirmacion(false);

        try {
            await userService.deleteUser(usuarioSeleccionadoId);
            setUsers(users.filter(user => user.id_auth !== usuarioSeleccionadoId));
            
            setAlertaResultado({
                titulo: "Usuario Eliminado",
                texto: "El usuario ha sido removido del sistema con éxito.",
                tipo: "exito"
            });
        } catch (error) {
            setAlertaResultado({
                titulo: "Error al Eliminar",
                texto: error.message || "No se pudo eliminar el usuario seleccionado.",
                tipo: "error"
            });
        } finally {
            setUsuarioSeleccionadoId(null);
        }
    };

    // Maneja la actualización del usuario desde el modal de edición
    const handleAction = async (e) => {
        e.preventDefault();
        try {
            await userService.updateUser(editTarget.id_auth, editTarget);
            
            setAlertaResultado({
                titulo: "¡Actualizado!",
                texto: "Los datos del usuario se han guardado correctamente.",
                tipo: "exito"
            });
            
            setEditTarget(null); // Cierra la ventana modal
            fetchUsers();        // Refresca la lista
        } catch (error) {
            setAlertaResultado({
                titulo: "Error al Actualizar",
                texto: error.message || "No se pudieron guardar los cambios.",
                tipo: "error"
            });
        }
    };
    
    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <>
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

        {/* === MODAL DE EDICIÓN === */}
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
                            <button type="button" className="Boton-Cancelar" onClick={() => setEditTarget(null)}>Cancelar</button>
                            <button type="submit" className="Boton-Guardar">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* === MODAL CONFIRMACIÓN ELIMINAR === */}
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


        {alertaResultado && (
            <div className="Modal-Overlay-Alerta" style={{ zIndex: 10001 }}>
                <div className={`Modal-Contenedor-Peligro ${alertaResultado.tipo}`}>
                    <div className="Modal-Header-Alerta">
                        <h3>{alertaResultado.titulo}</h3>
                        <button type="button" className="Modal-Cerrar-Alerta" onClick={() => setAlertaResultado(null)}>&times;</button>
                    </div>
                    <div className="Modal-Cuerpo-Alerta">
                        <p>{alertaResultado.texto}</p>
                    </div>
                    <div className="Modal-Footer-Alerta">
                        <button 
                            type="button"
                            className={`Modal-Boton-Aceptar-Resultado-Alerta ${alertaResultado.tipo}`} 
                            onClick={() => setAlertaResultado(null)}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default UserList;