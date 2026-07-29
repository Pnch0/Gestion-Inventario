import React from "react";
import { useState, useEffect } from "react";
import { saleService } from "../../Services/api.js";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaTrashAlt, FaBox } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

function SalesList({ refreshTrigger }){
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedSales, setExpandedSales] = useState({});
    const [editTarget, setEditTarget] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [ventaSeleccionadaId, setVentaSeleccionadaId] = useState(null);

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

    const fetchSales = async () => {
        try {
            setLoading(true);
            const data = await saleService.getSales();
            setSales(data);
        } catch (error) {
            setError(error.message);
            toast.error(`Error al cargar las ventas: ${error.message}`, toastStyles.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [refreshTrigger]);

    const handleDelete = (e, id_venta) => {
        e.stopPropagation();
        setVentaSeleccionadaId(id_venta);
        setMostrarConfirmacion(true);
    };

    const handleEdit = (e, sale) => {
        e.stopPropagation();
        setEditTarget(sale);
    };

    const ejecutarEliminacion = async () => {
        if (!ventaSeleccionadaId) return;
        setMostrarConfirmacion(false);

        try {
            await saleService.deleteSale(ventaSeleccionadaId);
            setSales(sales.filter(sale => sale.id_venta !== ventaSeleccionadaId));
            toast.success('La venta ha sido eliminada con éxito.', toastStyles.exito);
        } catch (error) {
            toast.error(error.message || 'No se pudo eliminar la venta.', toastStyles.error);
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
        } catch (error) {
            toast.error(error.message || 'No se pudieron guardar los cambios.', toastStyles.error);
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

    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;


    return(
        <>
        <div className="SalesList-Contenedor">
            {sales.length === 0 ? (
                <p>No hay ventas registradas</p>
            ) : (
                <ul className="ListaDatos-Ventas">
                    {sales.map((sale) =>(
                        <li key={sale.id_venta}>
                            <span>{sale.id_venta}</span>
                            <span>{sale.rut || 'Sin RUT'}</span>
                            <span>{formatDate(sale.fecha_hora)}</span>
                            <span>${sale.total_general}</span>

                            <div className="Acciones-Botones">
                                <button type="button" onClick={(e) => handleEdit(e, product)}>
                                    <FaEdit className="Icono-Acciones"/>
                                </button>
                                <button type="button" onClick={(e) => handleDelete(e, product.producto_id)}>
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
                            <h2>Editar Venta</h2>
                            <h3>Editando Venta ID: #{editTarget.id_venta}</h3>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="RutCliente">RUT Cliente:</label>
                                <input
                                    id="RutCliente"
                                    value={editTarget.rut || ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, rut: e.target.value })}
                                    placeholder="Ej: 12.345.678-9"
                                />
                            </div>

                            <div className="Campo-Formulario-Usuario">
                                <label htmlFor="TotalGeneral">Total General ($):</label>
                                <input
                                    id="TotalGeneral"
                                    type="number"
                                    value={editTarget.total_general ?? ''}
                                    onChange={(e) => setEditTarget({ ...editTarget, total_general: parseFloat(e.target.value) || 0 })}
                                    placeholder="Monto total de la venta"
                                    required
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

            {/* Modal de Confirmación de Eliminación */}
            {mostrarConfirmacion && (
                <div className="Modal-Overlay-Alerta" style={{ zIndex: 10000 }}>
                    <div className="Modal-Contenedor-Peligro peligro">
                        <div className="Modal-Header-Alerta">
                            <h3>¿Eliminar esta venta?</h3>
                            <button type="button" className="Modal-Cerrar-Alerta" onClick={() => setMostrarConfirmacion(false)}>&times;</button>
                        </div>
                        <div className="Modal-Cuerpo-Alerta">
                            <p>Esta acción eliminará el registro de la venta permanentemente. No podrás deshacer este cambio.</p>
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
};


export default SalesList;