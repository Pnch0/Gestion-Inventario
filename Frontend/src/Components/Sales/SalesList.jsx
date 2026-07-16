import React from "react";
import { useState, useEffect } from "react";
import { saleService } from "../../Services/api.js";

function SalesList(){
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedSales, setExpandedSales] = useState({});

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

    if (loading) return <div>Cargando Ventas...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;


    return(
        <>
        <div className="SalesList-Contenedor">
            <h2>Lista de Ventas</h2>
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
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </>
    )
};


export default SalesList;