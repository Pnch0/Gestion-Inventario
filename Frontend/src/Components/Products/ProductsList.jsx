import React from "react";
import { useState, useEffect } from "react";
import { productService } from "../../Services/api.js";

function ProductsList(){
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
    }, []);


    const handleDelete = async (producto_id) =>{
        if (!window.confirm('¿Estas seguro que deseas eliminar este producto?')){
            return;
        }

        try{
            const data = await productService.deleteProduct(producto_id);

            alert(data.message || 'Producto eliminado con exito');;

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
            <h2>Lista de Productos</h2>
            {products.length === 0 ? (
                <p>No hay productos registrados</p>

            ) : (
                <ul className="ListaDatos-Productos">
                    {products.map((product) =>(
                        <li key={product.producto_id}>
                            {product.imagen_url ? (
                                <img 
                                    src={product.imagen_url} 
                                    alt={product.nombre} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                                />
                            ) : (
                                <div style={{ width: '50px', height: '50px', backgroundColor: '#ccc', borderRadius: '4px', display: 'inline-block' }}>No img</div>
                            )}
                            <span>{product.nombre}</span>
                            <span>{product.categoria}</span>
                            <span>{product.marca}</span>
                            <span>{product.stock}</span>
                            <span>{product.precio_compra}</span>
                            <span>{product.precio_venta}</span>
                            <span>{product.ubicacion}</span>
                            <span>{product.descripcion}</span>

                            <div className="Acciones-Botones">
                                <button type="button" onClick={() => setEditTarget(product)}>
                                    Editar
                                </button>
                                <button type="button" onClick={() => handleDelete(product.producto_id)}>
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

export default ProductsList;