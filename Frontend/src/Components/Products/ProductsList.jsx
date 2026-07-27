import React from "react";
import { useState, useEffect } from "react";
import { productService } from "../../Services/api.js";
import { FaEdit, FaTrashAlt, FaBox } from "react-icons/fa";
import '../../Pages/Products/ProductsPage.css'

function ProductsList({ refreshTrigger }){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editTarget, setEditTarget] = useState(null);

    const fetchProducts = async () =>{
        try{
            setLoading(true);
            const data = await productService.getProducts();
            setProducts(data);
        
        } catch (error){
            setError(error.message);
        
        } finally{
            setLoading(false);
        }
    };

    useEffect(() =>{
        fetchProducts();
    }, [refreshTrigger]);

    const handleDelete = async (producto_id) =>{
        if (!window.confirm('¿Estas seguro que deseas eliminar este producto?')){
            return;
        }

        try{
            const data = await productService.deleteProduct(producto_id);

            alert(data.message || 'Producto eliminado con exito');

            setProducts(products.filter(product => product.producto_id !== producto_id));

        } catch (error){
            alert(`Error: ${error.message}`)
        }
    };

    if (loading) return <div>Cargando Productos...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return(
        <>
        <div className="ProductList-Contenedor">
            {products.length === 0 ? (
                <p>No hay productos registrados</p>

            ) : (
                <ul className="ListaDatos-Productos">
                    {products.map((product) =>(
                        <li key={product.producto_id} className="Fila-Productos">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="Contenedor-Imagen-Tabla">
                                    {product.imagen_url ? (
                                        <img 
                                            src={product.imagen_url} 
                                            alt={product.nombre} 
                                            className="Imagen-Producto-Tabla"
                                        />
                                    ) : (
                                        <div className="Sin-Imagen-Placeholder">
                                            <FaBox />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span>{product.nombre}</span>
                            <span>{product.categoria}</span>
                            <span>{product.stock}</span>
                            <span>{product.ubicacion}</span>
                            <span>{product.descripcion}</span>

                            <div className="Acciones-Botones">
                                <button type="button" onClick={() => setEditTarget(product)}>
                                    <FaEdit className="Icono-Acciones"/>
                                </button>
                                <button type="button" onClick={() => handleDelete(product.producto_id)}>
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

export default ProductsList;