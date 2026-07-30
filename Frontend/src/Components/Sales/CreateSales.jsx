import React, { useState, useEffect } from "react";
import { saleService, productService } from "../../Services/api";
import toast from 'react-hot-toast';

function CreateSales({ isOpen, onClose, onSaleCreated }) {
    const [rutCliente, setRutCliente] = useState('');
    const [detalles, setDetalles] = useState([]);
    const [productos, setProductos] = useState([]);

    const [currentProduct, setCurrentProduct] = useState({
        producto_id: '',
        nombre: '',
        cantidad_venta: 1,
        precio_unitario: 0,
        stockDisponible: 0
    });

    const [loading, setLoading] = useState(false);

    // Cargar la lista de productos disponibles al abrir el modal
    useEffect(() => {
        if (!isOpen) return;

        const fetchProductos = async () => {
            try {
                const data = await productService.getProducts();
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
                toast.error('Error al conectar con el servidor para obtener los productos');
            }
        };

        fetchProductos();
    }, [isOpen]);

    if (!isOpen) return null;

    // Manejar el cambio en el selector de productos y campos de cantidad
    const handleProductChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;

        if (name === 'producto_id') {
            const prodSeleccionado = productos.find(p => p.producto_id === Number(val));
            if (prodSeleccionado) {
                setCurrentProduct({
                    producto_id: Number(val),
                    nombre: prodSeleccionado.nombre,
                    precio_unitario: prodSeleccionado.precio_venta || 0,
                    stockDisponible: prodSeleccionado.stock || 0,
                    cantidad_venta: 1,
                });
            } else {
                setCurrentProduct({
                    producto_id: '',
                    nombre: '',
                    cantidad_venta: 1,
                    precio_unitario: 0,
                    stockDisponible: 0
                });
            }
        } else {
            setCurrentProduct(prev => ({
                ...prev,
                [name]: val
            }));
        }
    };

    // Agregar un producto a la lista temporal de detalles
    const handleAddProduct = (e) => {
        e.preventDefault();

        if (!currentProduct.producto_id) {
            toast.error('Por favor, selecciona un producto.');
            return;
        }

        if (currentProduct.cantidad_venta <= 0) {
            toast.error('La cantidad debe ser mayor a 0.');
            return;
        }

        if (currentProduct.cantidad_venta > currentProduct.stockDisponible) {
            toast.error(`Stock insuficiente. Solo quedan ${currentProduct.stockDisponible} unidades.`);
            return;
        }

        const existeIndex = detalles.findIndex(item => item.producto_id === currentProduct.producto_id);
        if (existeIndex !== -1) {
            const nuevosDetalles = [...detalles];
            const nuevaCantidad = nuevosDetalles[existeIndex].cantidad_venta + currentProduct.cantidad_venta;

            if (nuevaCantidad > currentProduct.stockDisponible) {
                toast.error(`No puedes agregar más de ${currentProduct.stockDisponible} unidades de este producto.`);
                return;
            }

            nuevosDetalles[existeIndex].cantidad_venta = nuevaCantidad;
            setDetalles(nuevosDetalles);
        } else {
            setDetalles([
                ...detalles,
                {
                    producto_id: currentProduct.producto_id,
                    nombre: currentProduct.nombre,
                    cantidad_venta: currentProduct.cantidad_venta,
                    precio_unitario: currentProduct.precio_unitario
                }
            ]);
        }

        // Limpiar selector del producto actual
        setCurrentProduct({
            producto_id: '',
            nombre: '',
            cantidad_venta: 1,
            precio_unitario: 0,
            stockDisponible: 0
        });
    };

    // Eliminar un producto de la lista temporal
    const handleRemoveProduct = (id) => {
        setDetalles(detalles.filter(item => item.producto_id !== id));
    };

    // Calcular el total general dinámicamente
    const calcularTotalGeneral = () => {
        return detalles.reduce((sum, item) => sum + (item.cantidad_venta * item.precio_unitario), 0);
    };

    // Enviar el formulario para registrar la venta
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Obtener el usuario logueado desde localStorage
        const rawUsuario = localStorage.getItem('usuario');
        const usuarioLogueado = rawUsuario ? JSON.parse(rawUsuario) : {};

        // Búsqueda del RUT (ahora revisa la propiedad 'perfil' que viene en tu localStorage)
        const rutTrabajador = 
            usuarioLogueado.perfil?.rut ||           // <--- AQUÍ ES DONDE ESTÁ EN TU CASO
            usuarioLogueado.rut || 
            usuarioLogueado.rut_vendedor || 
            usuarioLogueado.rut_usuario || 
            usuarioLogueado.usuario?.rut || 
            usuarioLogueado.id;                     // Fallback al ID de usuario de Supabase

        if (!rutTrabajador) {
            console.error("No se encontró RUT ni ID en localStorage:", usuarioLogueado);
            toast.error('No se detectó un usuario/vendedor activo. Por favor, vuelve a iniciar sesión.');
            setLoading(false);
            return;
        }

        if (detalles.length === 0) {
            toast.error('Debes agregar al menos un producto a la lista.');
            setLoading(false);
            return;
        }

        // 2. Armar el payload a enviar al backend
        const payload = {
            rut_vendedor: rutTrabajador,
            rut_cliente: rutCliente,
            detalles: detalles.map(item => ({
                producto_id: item.producto_id,
                cantidad_venta: item.cantidad_venta,
                precio_unitario: item.precio_unitario
            }))
        };

        try {
            await saleService.createSales(payload);
            toast.success('¡Venta registrada con éxito!');

            // Limpiar formulario y cerrar modal
            setRutCliente('');
            setDetalles([]);
            setCurrentProduct({
                producto_id: '',
                nombre: '',
                cantidad_venta: 1,
                precio_unitario: 0,
                stockDisponible: 0
            });

            if (onSaleCreated) onSaleCreated();
            onClose();

        } catch (error) {
            console.error("Error al registrar venta:", error);
            toast.error(error.message || 'Error al registrar la venta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form className="Formulario-Crear-Usuario" onSubmit={handleSubmit}>
                    <h2>Registrar Nueva Venta</h2>

                    <div className="Campo-Formulario-Usuario">
                        <label htmlFor="RutCliente">RUT del Cliente:</label>
                        <input
                            type="text"
                            id="RutCliente"
                            name="rutCliente"
                            onChange={(e) => setRutCliente(e.target.value)}
                            value={rutCliente}
                            placeholder="Ej: 12.345.678-9 (Opcional)"
                        />
                    </div>

                    <hr style={{ margin: '20px 0', border: '1px solid #eee' }} />
                    <h3>Agregar Productos</h3>

                    <div className="Campo-Formulario-Usuario">
                        <label htmlFor="Producto">Producto:</label>
                        <select
                            id="Producto"
                            name="producto_id"
                            value={currentProduct.producto_id}
                            onChange={handleProductChange}
                        >
                            <option value="">-- Selecciona un Producto --</option>
                            {productos.map(p => (
                                <option key={p.producto_id} value={p.producto_id}>
                                    {p.nombre} {p.marca ? `(${p.marca})` : ''} - Stock: {p.stock}
                                </option>
                            ))}
                        </select>
                    </div>

                    {currentProduct.producto_id && (
                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px', alignItems: 'flex-end' }}>
                            <div className="Campo-Formulario-Usuario" style={{ flex: 1 }}>
                                <label>Precio Unitario:</label>
                                <input
                                    type="text"
                                    value={`$${currentProduct.precio_unitario}`}
                                    disabled
                                />
                            </div>
                            <div className="Campo-Formulario-Usuario" style={{ flex: 1 }}>
                                <label htmlFor="Cantidad">Cantidad:</label>
                                <input
                                    type="number"
                                    id="Cantidad"
                                    name="cantidad_venta"
                                    value={currentProduct.cantidad_venta}
                                    onChange={handleProductChange}
                                    min="1"
                                    max={currentProduct.stockDisponible}
                                />
                            </div>
                            <button
                                type="button"
                                className="Boton-Guardar"
                                onClick={handleAddProduct}
                                style={{ marginBottom: '15px', height: '42px' }}
                            >
                                Agregar
                            </button>
                        </div>
                    )}

                    <hr style={{ margin: '20px 0', border: '1px solid #eee' }} />

                    {detalles.length > 0 && (
                        <div>
                            <h3>Detalle de la Venta</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #ddd' }}>
                                        <th>Producto</th>
                                        <th>Cant.</th>
                                        <th>Precio Unit.</th>
                                        <th>Subtotal</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map(item => (
                                        <tr key={item.producto_id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td>{item.nombre}</td>
                                            <td>{item.cantidad_venta}</td>
                                            <td>${item.precio_unitario}</td>
                                            <td>${item.cantidad_venta * item.precio_unitario}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    style={{ background: '#dc2626', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    onClick={() => handleRemoveProduct(item.producto_id)}
                                                >
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <h4 style={{ textAlign: 'right', marginBottom: '15px' }}>
                                Total General: ${calcularTotalGeneral()}
                            </h4>
                        </div>
                    )}

                    <div className="Botones-Modal">
                        <button
                            type="button"
                            className="Boton-Cancelar"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="Boton-Guardar"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Confirmar Venta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSales;