import './MainPage.css';
import { useState, useEffect } from 'react';
import { IoIosWarning } from "react-icons/io";
import { FaShoppingCart, FaFire } from "react-icons/fa";

function MainPage() {

    return (
        <>
        <div className="Contenedor-MainPage">
            <div className="ContenedorSecciones-MainPage">
                <div className="ContenedorSuperior-MainPage">
                    <div className="Contenedor-GananciasDia">
                        <h1>Dinero Ingresado el día de hoy: </h1>
                    </div>
                </div>
                <div className="ContenedorInferior-MainPage">
                    <div className="Contenedor-UltimasVentas">
                        <h2><FaShoppingCart  className='Icono-Shop'/>Últimas 5 Ventas</h2>
                    </div>
                    <div className="Contenedor-StockFaltante">
                        <h2><IoIosWarning className='Icono-Warning' />Stock Faltante</h2>
                    </div>
                    <div className="Contenedor-MasVendidos">
                        <h2><FaFire className='Icono-Fire'/>Productos más Vendidos</h2>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}

export default MainPage;