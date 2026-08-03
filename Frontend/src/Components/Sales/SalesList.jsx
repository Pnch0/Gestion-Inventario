import React, { useState, useEffect, useMemo } from "react";
import { saleService } from "../../Services/api.js";
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';
import '../../Pages/Sales/SalesPage.css';

function SalesList({ refreshTrigger, searchTerm = '', filterCriteria = 'Todos' }) {
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

    const processedRows = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();

        let rows = [];

        sales.forEach(sale => {
            const nombreVendedor = sale.Usuarios && (sale.Usuarios.nombre || sale.Usuarios.apellido)
                ? `${sale.Usuarios.nombre || ''} ${sale.Usuarios.apellido || ''}`.trim()
                : 'Vendedor sin registrar';

            const detalles = sale.Detalle_Venta || [];

            if (detalles.length === 0) {
                rows.push({
                    key: `empty-${sale.id_venta}`,
                    fecha: formatDate(sale.fecha_hora),
                    fechaRaw: sale.fecha_hora,
                    vendedor: nombreVendedor,
                    producto: 'Sin productos',
                    cantidad: 0,
                    categoria: 'Sin Categoría',
                    total: Number(sale.total_general || 0)
                });
            } else {
                detalles.forEach((detalle, index) => {
                    const producto = detalle.Productos || {};
                    const cantidad = detalle.cantidad_venta || 0;
                    const totalLineaVenta = detalle.total_linea || (cantidad * detalle.precio_unitario);
                    const categoriaNombre = producto.categoria || producto.Categorias?.nombre_categoria || 'Sin Categoría';

                    rows.push({
                        key: `${sale.id_venta}-${detalle.id_detalle || index}`,
                        fecha: formatDate(sale.fecha_hora),
                        fechaRaw: sale.fecha_hora,
                        vendedor: nombreVendedor,
                        producto: producto.nombre || 'Producto Desconocido',
                        cantidad,
                        categoria: categoriaNombre,
                        total: Number(totalLineaVenta)
                    });
                });
            }
        });


        if (query) {
            rows = rows.filter(row => {
                const vendedorMatch = row.vendedor.toLowerCase().includes(query);
                const productoMatch = row.producto.toLowerCase().includes(query);
                const categoriaMatch = row.categoria.toLowerCase().includes(query);
                const fechaMatch = row.fecha.toLowerCase().includes(query);

                if (filterCriteria === 'Por_Vendedor') {
                    return vendedorMatch;
                }
                return vendedorMatch || productoMatch || categoriaMatch || fechaMatch;
            });
        }


        if (filterCriteria === 'Mas_Vendidos') {
            rows.sort((a, b) => b.cantidad - a.cantidad);
        } else if (filterCriteria === 'Menos_Vendidos') {
            rows.sort((a, b) => a.cantidad - b.cantidad);
        } else if (filterCriteria === 'Por_Vendedor') {
            rows.sort((a, b) => a.vendedor.localeCompare(b.vendedor));
        } else {

            rows.sort((a, b) => new Date(b.fechaRaw) - new Date(a.fechaRaw));
        }

        return rows;
    }, [sales, searchTerm, filterCriteria]);

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
            ) : processedRows.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>No se encontraron ventas con los criterios especificados.</p>
            ) : (
                <ul className="ListaDatos-Ventas">
                    {processedRows.map((row) => (
                        <li key={row.key} className="Fila-Ventas">
                            <span>{row.fecha}</span>
                            <span>{row.vendedor}</span>
                            <span>{row.producto}</span>
                            <span>{row.cantidad}</span>
                            <span>{row.categoria}</span>
                            <span>${row.total.toLocaleString('es-CL')}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SalesList;