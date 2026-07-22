import React from "react";
import { useState, useEffect } from "react";
import { userService } from "../../Services/api.js";
import '../../Pages/Users/UsersPage.css';
import { FaEdit, FaTrashAlt  } from "react-icons/fa";

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editTarget, setEditTarget] = useState(null);

    const fetchUsers = async () =>{
        try{
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
        
        } catch (error){
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() =>{
        fetchUsers();
    }, []);

    const handleDelete = async (idAuth) => {
        if (!window.confirm('¿Estás seguro que deseas eliminar este usuario?')){
            return;
        }
        
        try {
            const data = await userService.deleteUser(idAuth);
        
            alert(data.message || 'Usuario eliminado con éxito');

            setUsers(users.filter(user => user.id_auth !== idAuth));
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };
    
    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;


    return(
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
        </>
    )
}

export default UserList;