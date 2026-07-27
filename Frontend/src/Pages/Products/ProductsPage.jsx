import './ProductsPage.css';
import { useState } from 'react';
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import ProductsList from '../../Components/Products/ProductsList.jsx';

function ProductsPage(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return(
        <>
        <div className="Contenedor-ListProducts">
            <div className="ContenedorSuperior-ListProducts">
                <button 
                    className='Boton-Funcion'
                    onClick={() => setIsModalOpen(true)}
                >
                    Agregar Producto
                </button>
                <button className='Boton-Producto'>
                    <FaRegUserCircle className='Icono-Perfil'/>
                </button>
            </div>

            <div className="ContenedorListado-ListadoProductos">
                <div className="ContenedorSuperior-ListadoProductos">
                    <div className="ContenedorSuperior-IzquierdaProductos">
                        <h2>Listado Productos</h2>
                    </div>
                    <div className="ContenedorSuperior-DerechaProductos">
                        <div className="Buscador-Productos">
                            <FaSearch className="Icono-Buscador" />
                            <input type="text" placeholder="Buscar producto..." />
                        </div>

                        <select className='Select-FiltroProductos'>
                            <option value="Todos">Todos los Productos</option>
                            <option value="Nombre">Nombre</option>
                            <option value="Categoria">Categoría</option>
                            <option value="Marca">Marca</option>
                            <option value="Ubicacion">Ubicación</option>
                        </select>
                    </div>
                </div>

                <div className="ContenedorEncabezado-ListadoProductos">
                    <ul>
                        <li>Imagen</li>
                        <li>Nombre</li>
                        <li>Categoria</li>
                        <li>Stock</li>
                        <li>Ubicación</li>
                        <li>Descripción</li>
                        <li>Acciones</li>
                    </ul>
                </div>
                <div className="Contenedor-ListadoProductos">
                    <ProductsList refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>

        </>
    )
}


export default ProductsPage;