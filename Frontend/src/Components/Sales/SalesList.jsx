import React, { useState, useEffect } from "react";
import { saleService } from "../../Services/api.js";
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';
import '../../Pages/Sales/SalesPage.css';

function SalesList({ refreshTrigger }) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editTarget, setEditTarget] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [ventaSeleccionadaId, setVentaSeleccionadaId] = useState(null);

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

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await saleService.getSales();
            setSales(data);
        } catch (err) {
            console.error("Error capturado en frontend:", err);
            setError(err.message);
            toast.error(`Error al cargar las ventas: ${err.message}`, toastStyles.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [refreshTrigger]);

    const ejecutarEliminacion = async () => {
        if (!ventaSeleccionadaId) return;
        setMostrarConfirmacion(false);

        try {
            await saleService.deleteSale(ventaSeleccionadaId);
            setSales(sales.filter(sale => sale.id_venta !== ventaSeleccionadaId));
            toast.success('La venta ha sido eliminada con éxito.', toastStyles.exito);
        } catch (err) {
            toast.error(err.message || 'No se pudo eliminar la venta.', toastStyles.error);
        } finally {
            setVentaSeleccionadaId(null);
        }
    };

    const handleAction = async (e) => {
        e.preventDefault();
        setEnviando(true);

        try {
            await saleService.updateSale(editTarget.id_venta, editTarget);
            setEditTarget(null);
            toast.success('¡La venta se ha actualizado correctamente!', toastStyles.exito);
            fetchSales();
        } catch (err) {
            toast.error(err.message || 'No se pudieron guardar los cambios.', toastStyles.error);
        } finally {
            setEnviando(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <ClipLoader color="#3da35d" loading={loading} size={50} />
        </div>
    );

    if (error) return <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>Error al obtener ventas: {error}</div>;

    return (
        <>
            <div className="SalesList-Contenedor">
                {sales.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>No hay ventas registradas</p>
                ) : (
                    <ul className="ListaDatos-Ventas">
                        {sales.map((sale) => {
                            const nombreVendedor = sale.Usuarios 
                                ? `${sale.Usuarios.nombre || ''} ${sale.Usuarios.apellido || ''}`.trim() 
                                : (sale.rut || 'Vendedor Desconocido');

                            const detalles = sale.Detalle_Venta || [];

                            if (detalles.length === 0) {
                                return (
                                    <li key={sale.id_venta} className="Fila-Ventas">
                                        <span>{formatDate(sale.fecha_hora)}</span>
                                        <span>{nombreVendedor}</span>
                                        <span>Sin productos</span>
                                        <span>0</span>
                                        <span>Unidad</span>
                                        <span>${sale.total_general}</span>
                                        <span>$0</span>
                                    </li>
                                );
                            }

                            return detalles.map((detalle, index) => {
                                const producto = detalle.Productos || {};
                                const cantidad = detalle.cantidad_venta || 0;
                                const totalLineaVenta = detalle.total_linea || (cantidad * detalle.precio_unitario);
                                
                                const precioCosto = producto.precio_costo || producto.precio_compra || 0;
                                const totalLineaCompra = cantidad * precioCosto;

                                return (
                                    <li key={`${sale.id_venta}-${detalle.id_detalle || index}`} className="Fila-Ventas">
                                        <span>{formatDate(sale.fecha_hora)}</span>
                                        <span>{nombreVendedor}</span>
                                        <span>{producto.nombre || 'Producto Desconocido'}</span>
                                        <span>{cantidad}</span>
                                        <span>{producto.unidad_medida || 'Unidad'}</span>
                                        <span>${Number(totalLineaVenta).toLocaleString('es-CL')}</span>
                                    </li>
                                );
                            });
                        })}
                    </ul>
                )}
            </div>
            
        </>
    );
}

export default SalesList;