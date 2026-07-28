import React from 'react';
import { FaBox, FaTimes } from 'react-icons/fa';

function ProductDetailModal({ product, onClose }) {
    if (!product) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-detalle" onClick={(e) => e.stopPropagation()}>
                {/* Botón X posicionado arriba a la derecha */}
                <button type="button" className="Boton-Cerrar-Modal" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="Detalle-Producto-Columna">
                    {/* 1. Imagen en la parte superior */}
                    <div className="Detalle-Imagen-Superior">
                        {product.imagen_url ? (
                            <img 
                                src={product.imagen_url} 
                                alt={product.nombre} 
                                className="Detalle-Imagen"
                            />
                        ) : (
                            <div className="Sin-Imagen-Placeholder Grande">
                                <FaBox size={60} />
                            </div>
                        )}
                    </div>

                    {/* Encabezado principal */}
                    <div className="Detalle-Header">
                        <h2>{product.nombre}</h2>
                        <span className="Badge-Categoria">{product.categoria || 'Sin categoría'}</span>
                    </div>

                    {/* 2. Datos del producto al centro */}
                    <div className="Detalle-Campos-Grid">
                        <div className="Campo-Detalle">
                            <span className="Etiqueta-Campo">Stock Disponible</span>
                            <p className="Valor-Campo">{product.stock ?? 0} unidades</p>
                        </div>
                        <div className="Campo-Detalle">
                            <span className="Etiqueta-Campo">Ubicación</span>
                            <p className="Valor-Campo">{product.ubicacion || 'No especificada'}</p>
                        </div>
                        <div className="Campo-Detalle">
                            <span className="Etiqueta-Campo">Marca</span>
                            <p className="Valor-Campo">{product.marca || 'N/A'}</p>
                        </div>
                        <div className="Campo-Detalle">
                            <span className="Etiqueta-Campo">Precio Compra</span>
                            <p className="Valor-Campo">${product.precio_compra || 'N/A'}</p>
                        </div>
                        <div className="Campo-Detalle">
                            <span className="Etiqueta-Campo">Precio Venta</span>
                            <p className="Valor-Campo">${product.precio_venta || 'N/A'}</p>
                        </div>
                    </div>

                    {/* 3. Descripción */}
                    <div className="Detalle-Descripcion-Inferior">
                        <span className="Etiqueta-Campo">Descripción Completa</span>
                        <p>{product.descripcion || 'Este producto no cuenta con una descripción detallada.'}</p>
                    </div>
                </div>

                <div className="Botones-Modal">
                    <button type="button" className="Boton-Cancelar" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;