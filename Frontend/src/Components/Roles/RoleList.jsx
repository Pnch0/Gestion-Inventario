import React from "react";
import { useState, useEffect } from "react";
import { roleService, userService } from "../../Services/api.js";

function RoleList(){
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editTarget, setEditTarget] = useState(null);


    const fetchUsers = async () =>{
        try{
            setLoading(true);
            const data = await roleService.getRole();
            setRoles(data)
        
        } catch (error){
            setError(error.message);
        
        } finally{
            setLoading(false);
        }
    };

    useEffect(() =>{
        fetchUsers();
    }, []);

    const handleDelete = async (rol_id) =>{
        if (!window.confirm('¿Estas seguro que deseas eliminar este rol?')){
            return;
        }

        try{
            const data = await roleService.deleteRole(rol_id);

            alert(data.message || 'Rol eliminado con éxito');

            setRoles(roles.filter(rol => rol.rol_id !== rol_id));
        
        } catch(error){
            alert(`Error: ${error.message}`);
        }
    };

    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;


    return(
        <>
        <div className="RoleList-Contenedor">
            <h2>Lista de Roles</h2>
            {roles.length === 0 ? (
                <p>No hay roles registrados</p>
            ) : (
                <ul className="ListaDatos-Roles">
                    {roles.map((rol) =>(
                        <li key={rol.rol_id}>
                            <span>{rol.rol_id}</span>
                            <span>{rol.nombre}</span>

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

export default RoleList;