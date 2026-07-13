import React from "react";
import { useState, useEffect } from "react";


export default function CreateUser({onUserCreated}){
    const [formData, setFormData] = useState({
        rut: '',
        rol_id: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        contraseña: '',
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

        if(!formData.correo || !formData.contraseña || !formData.rut){
            setError(' Correo, contraseña y RUT son obligatorios');
            setLoading(false);
            return;
        }

        try{
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

        const data = await response.json();

        if (!response.ok){
            throw new Error(data.error || 'Error al crear el usuario');
        }

        setSuccess('Usuario creado con éxito');
        setFormData({
            rut: '',
            rol_id: '',
            nombre: '',
            apellido: '',
            correo: '',
            telefono: '',
            contraseña: ''
        });

        if (onUserCreated) onUserCreated();
        
    } catch (error){
        setError(error.message);
    
    } finally{
        setLoading(false)
    }
};

return(
    <>
    <div className="CreateUser-Contenedor">
        <h2>Crear Nuevo Usuario</h2>

        {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
        {success && <div className="success-message" style={{ color: 'green' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
            <div>
                <label id="Rut"> RUT (con guión y dígito verificador): </label>
                <input 
                type="text" 
                id="Rut"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="12345678-K"
                required
                />
            </div>

            <div>
                <label id="Nombre">Nombre: </label>
                <input 
                type="text"
                id="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                />
            </div>

            <div>
                <label id="Apellido">Apellido: </label>
                <input 
                type="text"
                id="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                />
            </div>

            <div>
                <label id="Correo"> Correo Electronico: </label>
                <input 
                type="email" 
                id="Correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                />
            </div>

            <div>
                <label id="Telefono">Telefono: </label>
                <input 
                type="text" 
                id="Telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                />
            </div>

            <div>
                <label id="Contraseña">Contraseña: </label>
                <input 
                type="password" 
                id="Contraseña"
                name="contraseña"
                value={formData.contraseña}
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
);
}