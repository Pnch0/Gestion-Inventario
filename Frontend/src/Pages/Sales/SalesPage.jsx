import './SalesPage.css';
import { useState, useEffect } from "react";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import SalesList from '../../Components/Sales/SalesList.jsx';
import CreateSales from '../../Components/Sales/CreateSales.jsx';

function SalesPage(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSaleCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return(
        <>
        <div className="Contenedor-SalesPage">
            <div className="ContenedorSuperior-SalesPage">
                <button
                className="Boton-Funcion"
                onClick={() => setIsModalOpen(true)}
                >
                    Registrar Venta
                </button>
                <button className="Boton-Venta">
                    <FaRegUserCircle className='Icono-Perfil'/>
                </button>
            </div>

            <div className="ContenedorListado-Ventas">
                <div className="ContenedorSuperior-ListadoVentas">
                    <div className="ContenedorSuperior-IzquierdaVentas">
                        <h2>Listado Ventas</h2>
                    </div>
                    <div className="ContenedorSuperior-DerechaVentas">
                        <div className="Buscador-Ventas">
                            <FaSearch className="Icono-Buscador" />
                            <input type="text" placeholder='Buscar Venta...'/>
                        </div>

                        <select className='Select-FiltroVentas'>
                            <option value="Todos">Todos las Ventas</option>
                            <option value="Mas_Vendidos">Productos más Vendidos</option>
                            <option value="Menos_Vendidos">Productos sin ventas (Más tiempo estancados)</option>
                            <option value="Por_Vendedor">Ventas por Vendedor</option>
                        </select>
                    </div>
                </div>

                <div className="ContenedorEncabezado-ListadoVentas">
                    <ul>
                        <li>Fecha y Hora</li>
                        <li>Nombre Vendedor</li>
                        <li>Producto Vendido</li>
                        <li>Cantidad</li>
                        <li>Unidad de Venta</li>
                        <li>Total Venta</li>
                    </ul>
                </div>

                <div className="Contenedor-ListadoVentas">
                    <SalesList refreshTrigger={refreshTrigger}/>
                </div>

            </div>
        </div>

        <CreateSales
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSaleCreated={handleSaleCreated}
        />
        </>
    )
}

export default SalesPage;