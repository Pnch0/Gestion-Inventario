import React, { useState } from "react";
import { userService } from "../../Services/api.js";
import toast from 'react-hot-toast';

const toastStyles = {
    exito: {
        duration: 4000,
        position: 'top-center',
        style: { border: '1px solid #BBF7D0', padding: '16px', color: '#166534', background: '#EDFCF2' },
        iconTheme: { primary: '#15803D', secondary: '#EDFCF2' }
    },
    error: {
        duration: 4000,
        position: 'top-center',
        style: { border: '1px solid #FECDD3', padding: '16px', color: '#991B1B', background: '#FFF1F2' },
        iconTheme: { primary: '#991B1B', secondary: '#FFF1F2' }
    }
};

function CreateUser({ isOpen, onClose, onUserCreated }) {
    const [formData, setFormData] = useState({
        rut: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        rol_id: '',
        contraseña: ''
    });

    const [enviando, setEnviando] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'rol_id' ? parseInt(value) || '' : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            await userService.createUser(formData);
            toast.success('¡Usuario registrado con éxito!', toastStyles.exito);

            setFormData({
                rut: '', nombre: '', apellido: '', correo: '',
                telefono: '', rol_id: '', contraseña: ''
            });

            if (onUserCreated) onUserCreated();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Error al registrar al usuario', toastStyles.error);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form className="Formulario-Crear-Usuario" onSubmit={handleSubmit}>
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
                            onClick={onClose}
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
    );
}

export default CreateUser;