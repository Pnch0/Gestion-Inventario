import React from "react";
import { useState, useEffect } from "react";
import { userService } from './Services/api.js';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () =>{
        try{
            setLoading(true);
            const response = await fetch('api/users');
            if (!response.ok){
                throw new Error('Error al obtener la lista de usuarios');
            }

            const data = await response.json();
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
        
        try{
            const response = await fetch(`/api/users/${idAuth}`,{
                method: 'DELETE'
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'No se pudo eliminar el usuario');
            }
        
            alert(data.message);

            setUsers(users.filter(user => user.id_auth !== idAuth));

        } catch (error){
            alert(`Error: ${error.message}`)
        }   
    };
    
    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;


    return(
        <>
        <div className="UserList-Contenedor">
            <h2>Lista de Usuarios</h2>
            {users.length === 0 ? (
                <p>No hya usuarios registrados</p>
            ) : (
                <ul className="ListaDatos-Usuarios">
                    {users.map((user) => (
                        <li key={user.id_auth}>
                            <span>{user.rut}</span>
                            <span>{user.nombre_rol}</span>
                            <span>{user.nombre}</span>
                            <span>{user.apellido}</span>
                            <span>{user.correo}</span>
                            <span>{user.telefono}</span>
                            <span>Activo</span>
                            <div className="Acciones-Botones">
                                <button type="button" onClick={() => setEditTarget(user)}>
                                    Editar
                                </button>
                                <button type="button" onClick={() => handleDelete(user.id_auth)}>
                                    Borrar
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