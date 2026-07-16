import React from "react";
import { useState, useEffect } from "react";
import { roleService } from "../../Services/api.js";


function CreateRole(){
    const [formData, setFormData] = useState({
        rol_id: '',
        nombre: ''
    });

    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading('');

        if(!formData.nombre){
            setError('El nombre es obligatorio');
            setLoading(false);
            return;
        }

        try{
            const response = await fetch(`/api/roles`,{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Error al crear el rol');
            }

            setSuccess('Rol creado con éxito');

            setFormData({
                rol_id: '',
                nombre: ''
            });

        } catch (error){
            setError(error.message);
        
        } finally{
            setLoading(false)
        }

    };

    return(
        <>
        <div className="CreateRole-Contenedor">
            <h2>Crear Nuevo Rol</h2>

            {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
            {success && <div className="success-message" style={{ color: 'green' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
            <div>
                <label id="Nombre">Nombre:</label>
                <input 
                type="text" 
                id="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Crear Usuario'}
            </button>
        </form>
        
        </div>
        </>
    )
}

export default CreateRole;