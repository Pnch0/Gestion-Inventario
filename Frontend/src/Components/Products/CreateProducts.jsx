import React from "react";
import { useState, useEffect } from "react";
import { productService } from "../../Services/api.js";
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';


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


function CreateProduct({ isOpen, onClose, onProductCreated }) {
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        marca: '',
        stock: 0,
        precio_compra: 0,
        precio_venta: 0,
        ubicacion: '',
        descripcion: ''
    });

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [compressing, setCompressing] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleFileChange = async (e) => {
        const originalFile = e.target.files[0];
        if (!originalFile) return;

        const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            fileType: 'image/webp'
        };

        try {
            setCompressing(true);
            toast.loading('Optimizando imagen...', { id: 'compressToast' });

            const compressedFile = await imageCompression(originalFile, options);

            setFile(compressedFile);
            toast.success('Imagen optimizada con éxito', { id: 'compressToast', ...toastStyles.exito });
        } catch (error) {
            console.error("Error al comprimir la imagen:", error);
            setFile(originalFile);
            toast.dismiss('compressToast');
            toast.error('Error al optimizar la imagen, se usará la original', toastStyles.error);
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.nombre || !formData.categoria || !formData.stock || !formData.precio_venta) {
            toast.error('Nombre, categoría, stock y precio de venta son obligatorios', toastStyles.error);
            setLoading(false);
            return;
        }

        try {
            const dataToSend = new FormData();
            
            Object.keys(formData).forEach(key => {
                dataToSend.append(key, formData[key]);
            });

            if (file) {
                dataToSend.append('imagen', file);
            }

            await productService.createProducts(dataToSend);

            toast.success('¡Producto creado con éxito!', toastStyles.exito);

            setFormData({
                nombre: '', categoria: '', marca: '', stock: 0,
                precio_compra: 0, precio_venta: 0, ubicacion: '', descripcion: ''
            });
            setFile(null);

            if (onProductCreated) onProductCreated();
            onClose();

        } catch (error) {
            toast.error(error.message || 'Hubo un error al registrar el producto', toastStyles.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form className="Formulario-Crear-Usuario" onSubmit={handleSubmit}>
                    <h2>Crear Nuevo Producto</h2>

                    <div className="Campo-Formulario-Usuario">
                        <label htmlFor="nombre">Nombre:</label>
                        <input 
                            type="text" 
                            id="nombre"
                            name="nombre"
                            onChange={handleChange}
                            value={formData.nombre}
                            required
                        />
                    </div>

                    <div className="Fila-Doble">
                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="categoria">Categoría:</label>
                            <input 
                                type="text" 
                                id="categoria"
                                name="categoria"
                                onChange={handleChange}
                                value={formData.categoria}
                                required
                            />
                        </div>
                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="marca">Marca:</label>
                            <input 
                                type="text" 
                                id="marca"
                                name="marca"
                                onChange={handleChange}
                                value={formData.marca}
                            />
                        </div>
                    </div>

                    <div className="Fila-Doble">
                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="stock">Stock:</label>
                            <input 
                                type="number" 
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="ubicacion">Ubicación:</label>
                            <input 
                                type="text" 
                                id="ubicacion"
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="Fila-Doble">
                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="precio_compra">Precio Compra:</label>
                            <input 
                                type="number" 
                                id="precio_compra"
                                name="precio_compra"
                                value={formData.precio_compra}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="Campo-Formulario-Usuario">
                            <label htmlFor="precio_venta">Precio Venta:</label>
                            <input 
                                type="number" 
                                id="precio_venta"
                                name="precio_venta"
                                value={formData.precio_venta}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="Campo-Formulario-Usuario">
                        <label htmlFor="descripcion">Descripción:</label>
                        <input 
                            type="text" 
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="Campo-Formulario-Usuario">
                        <label htmlFor="imagen">Imagen:</label>
                        <input 
                            type="file" 
                            id="imagen"
                            name="imagen"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={compressing}
                        />
                    </div>

                    <div className="Botones-Modal">
                        <button 
                            type="button" 
                            className="Boton-Cancelar" 
                            onClick={onClose}
                            disabled={loading || compressing}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="Boton-Guardar"
                            disabled={loading || compressing}
                        >
                            {loading ? 'Guardando...' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateProduct;