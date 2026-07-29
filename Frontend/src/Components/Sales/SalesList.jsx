import React from "react";
import { useState, useEffect } from "react";
import { saleService } from "../../Services/api.js";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaTrashAlt, FaBox } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

function SalesList(){
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedSales, setExpandedSales] = useState({});

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

    const fetchSales = async () =>{
        try{
            setLoading(true);
            const data = await saleService.getSales();
            setSales(data);
        
        } catch (error){
            setError(error.message);
        
        } finally{
            setLoading(false);
        }
    };

    useEffect (() => {
        fetchSales();
    }, []);


    const toggleDetails = (id_venta) => {
        setExpandedSales((prev) => ({
            ...prev,
            [id_venta]: !prev[id_venta]
        }));
    };

    const formatDate = (dateString) => {
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
        </>
    )
};


export default SalesList;