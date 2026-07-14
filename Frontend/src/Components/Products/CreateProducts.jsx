import React from "react";
import { useState, useEffect } from "react";
import { productService } from "../../Services/api.js";


function CreateProduct(){
    const [formData, setFormData] = useState({
        producto_id: '',
        nombre: '',
        categoria: '',
        marca: '',
        stock: 0,
        precio_compra: 0,
        precio_venta: 0,
        ubicacion: '',
        descripcion: '',
        imagen_url: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [name]: type === 'number' ? Number(value) : value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if(!formData.nombre || !formData.stock || !formData.precio_compra || !formData.precio_venta){
            setError('Nombre, stock, precio compra y precio venta son obligatorios');
            setLoading(false);
            return;
        }

        try{
            const response = await fetch(`/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
        
        const data = await response.json();

        if (!response.ok){
            throw new Error(data.error || 'Error al crear el producto');
        }

        setSuccess('Producto creado con éxito');
        setFormData({
            producto_id: '',
            nombre: '',
            categoria: '',
            marca: '',
            stock: 0,
            precio_compra: 0,
            precio_venta: 0,
            ubicacion: '',
            descripcion: '',
            imagen_url: '',
        });

        } catch (error){
            setError(error.message);
        } finally{
            setLoading(false)
        }
    };

    return(
        <>
        <div className="ProductUser-Contenedor">
            <h2>Crear Nuevo Producto</h2>
            
            {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
            {success && <div className="success-message" style={{ color: 'green' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
            <div>
                <label id="Nombre">Nombre:</label>
                <input 
                type="text" 
                id="Nombre"
                name="nombre"
                onChange={handleChange}
                value={formData.nombre}
                required
                />
            </div>

            <div>
                <label id="Categoria">Categoria:</label>
                <input 
                type="text" 
                id="Categoria"
                name="categoria"
                onChange={handleChange}
                value={formData.categoria}
                />
            </div>

            <div>
                <label id="Marca">Marca:</label>
                <input 
                type="text" 
                id="Marca"
                name="marca"
                onChange={handleChange}
                value={formData.marca}
                />
            </div>

            <div>
                <label id="Stock">Stock:</label>
                <input 
                type="number" 
                id="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                />
            </div>

            <div>
                <label id="Precio_Compra">Precio Compra:</label>
                <input 
                type="number" 
                id="Precio_Compra"
                name="precio_compra"
                value={formData.precio_compra}
                onChange={handleChange}
                required
                />
            </div>

            <div>
                <label id="Precio_Venta">Precio Venta:</label>
                <input 
                type="number" 
                id="Precio_Venta"
                name="precio_venta"
                value={formData.precio_venta}
                onChange={handleChange}
                required
                />
            </div>

            <div>
                <label id="Ubicacion">Ubicación:</label>
                <input 
                type="text" 
                id="Ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                />
            </div>

            <div>
                <label id="Descripcion">Descripción:</label>
                <input 
                type="text" 
                id="Descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                />
            </div>

            <div>
                <label id="Imagen">Imagen:</label>
                <input 
                type="file" 
                id="Imagen"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleChange}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Crear Producto'}
            </button>

        </form>
        
        </div>
        </>
    );
}

export default CreateProduct;