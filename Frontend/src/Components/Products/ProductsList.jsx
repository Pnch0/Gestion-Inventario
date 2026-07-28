import React from "react";
import { useState, useEffect } from "react";
import { productService } from "../../Services/api.js";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrashAlt, FaBox } from "react-icons/fa";
import '../../Pages/Products/ProductsPage.css'

function ProductsList({ refreshTrigger }){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editTarget, setEditTarget] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);

    const toastStyles = {
        exito: {
            duration: 4000,
            position: 'top-center',
            style: {
                border: '1px solid #BBF7D0',
                padding: '16px',
                color: '#166534',
                background: '#EDFCF2',
            },
            iconTheme: {
                primary: '#15803D',
                secondary: '#EDFCF2',
            },
        },
        error: {
            duration: 4000,
            position: 'top-center',
            style: {
                border: '1px solid #FECDD3',
                padding: '16px',
                color: '#991B1B',
                background: '#FFF1F2',
            },
            iconTheme: {
                primary: '#991B1B',
                secondary: '#FFF1F2',
            },
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            setProducts(data);
        } catch (error) {
            setError(error.message);
            toast.error(`Error al cargar productos: ${error.message}`, toastStyles.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshTrigger]);

    const handleDelete = (producto_id) => {
        setProductoSeleccionadoId(producto_id);
        setMostrarConfirmacion(true);
    };

    const ejecutarEliminacion = async () => {
        if (!productoSeleccionadoId) return;
        setMostrarConfirmacion(false);

        try {
            await productService.deleteProduct(productoSeleccionadoId);
            setProducts(products.filter(product => product.producto_id !== productoSeleccionadoId));
            toast.success('El producto ha sido eliminado con éxito.', toastStyles.exito);
        } catch (error) {
            toast.error(error.message || 'No se pudo eliminar el producto.', toastStyles.error);
        } finally {
            setProductoSeleccionadoId(null);
        }
    };

    const handleAction = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            await productService.updateProduct(editTarget.producto_id, editTarget);
            setEditTarget(null);
            toast.success('¡El producto se ha actualizado correctamente!', toastStyles.exito);
            fetchProducts();
        } catch (error) {
            toast.error(error.message || 'No se pudieron guardar los cambios.', toastStyles.error);
        } finally {
            setEnviando(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <ClipLoader color="#3da35d" loading={loading} size={50} />
        </div>
    );

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

        {editTarget && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form className="Formulario-Crear-Usuario" onSubmit={handleAction}>
                            <h2>Editar Producto</h2>
                            <h3>Editando: {editTarget.nombre}</h3>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="NombreProducto">Nombre del Producto:</label>
                                <input
                                    id="NombreProducto"
                                    value={editTarget.nombre || ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, nombre: e.target.value })}
                                    placeholder="Nombre del producto"
                                    required
                                />
                            </div>

                            <div className="Fila-Doble">
                                <div className="Campo-Formulario-Usuario">
                                    <label htmlFor="Categoria">Categoría:</label>
                                    <input
                                        id="Categoria"
                                        value={editTarget.categoria || ''}
                                        onChange={(e) => setEditTarget({ ...editTarget, categoria: e.target.value })}
                                        placeholder="Categoría"
                                        required
                                    />
                                </div>

                                <div className="Campo-Formulario-Usuario">
                                    <label htmlFor="Stock">Stock:</label>
                                    <input
                                        id="Stock"
                                        type="number"
                                        value={editTarget.stock ?? ''}
                                        onChange={(e) => setEditTarget({ ...editTarget, stock: parseInt(e.target.value) || 0 })}
                                        placeholder="Cantidad en stock"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="Ubicacion">Ubicación:</label>
                                <input
                                    id="Ubicacion"
                                    value={editTarget.ubicacion || ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, ubicacion: e.target.value })}
                                    placeholder="Ubicación en bodega o tienda"
                                />
                            </div>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="ImagenUrl">URL de Imagen:</label>
                                <input
                                    id="ImagenUrl"
                                    value={editTarget.imagen_url || ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, imagen_url: e.target.value })}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="Descripcion">Descripción:</label>
                                <textarea
                                    id="Descripcion"
                                    rows="3"
                                    value={editTarget.descripcion || ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, descripcion: e.target.value })}
                                    placeholder="Descripción del producto"
                                />
                            </div>

                            <div className="Botones-Modal">
                                <button 
                                    type="button" 
                                    className="Boton-Cancelar" 
                                    onClick={() => setEditTarget(null)}
                                    disabled={enviando}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="Boton-Guardar"
                                    disabled={enviando}
                                >
                                    {enviando ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mostrarConfirmacion && (
                <div className="Modal-Overlay-Alerta" style={{ zIndex: 10000 }}>
                    <div className="Modal-Contenedor-Peligro peligro">
                        <div className="Modal-Header-Alerta">
                            <h3>¿Eliminar este producto?</h3>
                            <button type="button" className="Modal-Cerrar-Alerta" onClick={() => setMostrarConfirmacion(false)}>&times;</button>
                        </div>
                        <div className="Modal-Cuerpo-Alerta">
                            <p>Esta acción removerá el producto de forma permanente del inventario. No podrás deshacer este cambio.</p>
                        </div>
                        <div className="Modal-Footer-Alerta doble-boton">
                            <button type="button" className="Modal-Boton-Cancelar-Alerta" onClick={() => setMostrarConfirmacion(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="Modal-Boton-Confirmar-Alerta" onClick={ejecutarEliminacion}>
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductsList;