import './ProductsPage.css';
import { useState } from 'react';
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import ProductsList from '../../Components/Products/ProductsList.jsx';
import CreateProduct from '../../Components/Products/CreateProducts.jsx';

function ProductsPage(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('Todos');

    const handleProductCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

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
                            <input 
                                type="text" 
                                placeholder="Buscar producto..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select 
                            className='Select-FiltroProductos'
                            value={filterCriteria}
                            onChange={(e) => setFilterCriteria(e.target.value)}
                        >
                            <option value="Todos">Todos los Campos</option>
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
                    <ProductsList 
                        refreshTrigger={refreshTrigger} 
                        searchTerm={searchTerm}
                        filterCriteria={filterCriteria}
                    />
                </div>
            </div>
        </div>

        <CreateProduct 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onProductCreated={handleProductCreated}
        />

        </>
    )
}


export default ProductsPage;