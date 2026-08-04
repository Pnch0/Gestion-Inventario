import './MainPage.css';
import { useState, useEffect, useMemo } from 'react';
import { IoIosWarning } from "react-icons/io";
import { FaShoppingCart, FaFire, FaTimes } from "react-icons/fa";
import { saleService, productService } from '../../Services/api.js';
import { ClipLoader } from "react-spinners";

function MainPage() {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [salesData, productsData] = await Promise.all([
                    saleService.getSales(),
                    productService.getProducts()
                ]);
                setSales(salesData || []);
                setProducts(productsData || []);
            } catch (error) {
                console.error("Error al cargar datos en MainPage:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const gananciasHoy = useMemo(() => {
        const hoyStr = new Date().toISOString().split('T')[0];
        return sales.reduce((total, sale) => {
            if (!sale.fecha_hora) return total;
            const fechaVentaStr = new Date(sale.fecha_hora).toISOString().split('T')[0];
            if (fechaVentaStr === hoyStr) {
                return total + Number(sale.total_general || 0);
            }
            return total;
        }, 0);
    }, [sales]);


    const ultimasVentas = useMemo(() => {
        return [...sales]
            .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
            .slice(0, 5);
    }, [sales]);

    const stockFaltante = useMemo(() => {
        return products.filter(p => Number(p.stock) <= 5);
    }, [products]);

    const masVendidos = useMemo(() => {
        const conteoProductos = {};

        sales.forEach(sale => {
            (sale.Detalle_Venta || []).forEach(detalle => {
                const nombre = detalle.Productos?.nombre || `Producto #${detalle.producto_id}`;
                const cantidad = Number(detalle.cantidad_venta || 0);
                conteoProductos[nombre] = (conteoProductos[nombre] || 0) + cantidad;
            });
        });

        return Object.entries(conteoProductos)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad);
    }, [sales]);

    const closeModal = () => setActiveModal(null);

    return (
        <>
        <div className="Contenedor-MainPage">
            <div className="ContenedorSecciones-MainPage">
                <div className="ContenedorSuperior-MainPage">
                    <div className="Contenedor-GananciasDia">
                        <h1>
                            Dinero Ingresado el día de hoy: {' '}
                            <span>
                                {loading ? '$ ...' : `$${gananciasHoy.toLocaleString('es-CL')}`}
                            </span>
                        </h1>
                    </div>
                </div>
                
                <div className="ContenedorInferior-MainPage">
                    <div 
                        className="Contenedor-UltimasVentas Tarjeta-Clickable"
                        onClick={() => setActiveModal('ventas')}
                    >
                        <h2><FaShoppingCart className='Icono-Shop'/>Últimas 5 Ventas</h2>
                    </div>

                    <div 
                        className="Contenedor-StockFaltante Tarjeta-Clickable"
                        onClick={() => setActiveModal('stock')}
                    >
                        <h2><IoIosWarning className='Icono-Warning' />Stock Faltante</h2>
                    </div>

                    <div 
                        className="Contenedor-MasVendidos Tarjeta-Clickable"
                        onClick={() => setActiveModal('masVendidos')}
                    >
                        <h2><FaFire className='Icono-Fire'/>Productos más Vendidos</h2>
                    </div>
                </div>
            </div>
        </div>

        {activeModal && (
            <div className="Modal-MainPage-Overlay" onClick={closeModal}>
                <div className="Modal-MainPage-Content" onClick={(e) => e.stopPropagation()}>
                    <button className="Boton-Cerrar-Modal" onClick={closeModal}>
                        <FaTimes />
                    </button>

                    {activeModal === 'ventas' && (
                        <div>
                            <h2><FaShoppingCart className='Icono-Shop'/> Últimas 5 Ventas</h2>
                            {loading ? (
                                <div className="Loader-Modal"><ClipLoader color="#3da35d" size={40} /></div>
                            ) : ultimasVentas.length === 0 ? (
                                <p>No hay ventas registradas.</p>
                            ) : (
                                <table className="Tabla-Modal">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Vendedor</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ultimasVentas.map((v) => (
                                            <tr key={v.id_venta}>
                                                <td>{new Date(v.fecha_hora).toLocaleString('es-CL')}</td>
                                                <td>
                                                    {v.Usuarios 
                                                        ? `${v.Usuarios.nombre || ''} ${v.Usuarios.apellido || ''}`.trim() 
                                                        : 'Sin registrar'}
                                                </td>
                                                <td>${Number(v.total_general || 0).toLocaleString('es-CL')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}


                    {activeModal === 'stock' && (
                        <div>
                            <h2><IoIosWarning className='Icono-Warning' /> Stock Faltante (Crítico)</h2>
                            {loading ? (
                                <div className="Loader-Modal"><ClipLoader color="#3da35d" size={40} /></div>
                            ) : stockFaltante.length === 0 ? (
                                <p>Todos los productos tienen stock suficiente.</p>
                            ) : (
                                <table className="Tabla-Modal">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Stock Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockFaltante.map((p) => (
                                            <tr key={p.producto_id}>
                                                <td>{p.nombre}</td>
                                                <td>{p.categoria}</td>
                                                <td className="Stock-Alerta">{p.stock} u.</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {activeModal === 'masVendidos' && (
                        <div>
                            <h2><FaFire className='Icono-Fire'/> Productos más Vendidos</h2>
                            {loading ? (
                                <div className="Loader-Modal"><ClipLoader color="#3da35d" size={40} /></div>
                            ) : masVendidos.length === 0 ? (
                                <p>No hay datos de ventas disponibles.</p>
                            ) : (
                                <table className="Tabla-Modal">
                                    <thead>
                                        <tr>
                                            <th>Posición</th>
                                            <th>Producto</th>
                                            <th>Unidades Vendidas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {masVendidos.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>#{idx + 1}</td>
                                                <td>{item.nombre}</td>
                                                <td>{item.cantidad} u.</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}
        </>
    );
}

export default MainPage;