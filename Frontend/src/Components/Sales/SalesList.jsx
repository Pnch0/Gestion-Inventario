import React, { useState, useEffect } from "react";
import { saleService } from "../../Services/api.js";
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';
import '../../Pages/Sales/SalesPage.css';

function SalesList({ refreshTrigger }) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <div className="SalesList-Contenedor">
            {sales.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>No hay ventas registradas</p>
            ) : (
                <ul className="ListaDatos-Ventas">
                    {sales.map((sale) => {

                        const nombreVendedor = sale.Usuarios && (sale.Usuarios.nombre || sale.Usuarios.apellido)
                            ? `${sale.Usuarios.nombre || ''} ${sale.Usuarios.apellido || ''}`.trim() 
                            : 'Vendedor sin registrar';

                        const detalles = sale.Detalle_Venta || [];

                        if (detalles.length === 0) {
                            return (
                                <li key={sale.id_venta} className="Fila-Ventas">
                                    <span>{formatDate(sale.fecha_hora)}</span>
                                    <span>{nombreVendedor}</span>
                                    <span>Sin productos</span>
                                    <span>0</span>
                                    <span>Sin Categoría</span>
                                    <span>${Number(sale.total_general || 0).toLocaleString('es-CL')}</span>
                                </li>
                            );
                        }

                        return detalles.map((detalle, index) => {
                            const producto = detalle.Productos || {};
                            const cantidad = detalle.cantidad_venta || 0;
                            const totalLineaVenta = detalle.total_linea || (cantidad * detalle.precio_unitario);
                            
                            const categoriaNombre = 
                                producto.categoria || 
                                producto.Categorias?.nombre_categoria || 
                                'Sin Categoría';

                            return (
                                <li key={`${sale.id_venta}-${detalle.id_detalle || index}`} className="Fila-Ventas">
                                    <span>{formatDate(sale.fecha_hora)}</span>
                                    <span>{nombreVendedor}</span>
                                    <span>{producto.nombre || 'Producto Desconocido'}</span>
                                    <span>{cantidad}</span>
                                    <span>{categoriaNombre}</span>
                                    <span>${Number(totalLineaVenta).toLocaleString('es-CL')}</span>
                                </li>
                            );
                        });
                    })}
                </ul>
            )}
        </div>
    );
}

export default SalesList;