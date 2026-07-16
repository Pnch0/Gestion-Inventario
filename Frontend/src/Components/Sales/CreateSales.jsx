import React from "react";
import { useState, useEffect } from "react";
import { saleService } from "../../Services/api.js";


function CreateSales(){
    const [rut, setRut] = useState('');
    const [detalles, setDetalles] = useState([]);
    const [productos, setProductos] = useState([]);

    const [currentProduct, setCurrentProduct] = useState({
        producto_id: '',
        nombre: '',
        cantidad_venta: 1,
        precio_unitario: 0,
        stockDisponible: 0
    })

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() =>{
        const fetchProductos = async () =>{
            try{
                const response = await fetch(`/api/products`);
                const data = await response.json();

                if (!response.ok){
                    setProductos(data);
            
                } else{
                    setError('No se pudieron cargar los productos');
                }
            
            } catch (error){
                setError('Error al conectar con el servidor para obtener los productos')
            }
        };

        fetchProductos();
    }, []);

    const handleProductChange = (e) =>{
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;


        if (name === 'producto_id'){
            const prodSeleccionado = productos.find(p => p.producto_id === val);
            if(prodSeleccionado){
                setCurrentProduct({
                    producto_id: val,
                    nombre: prodSeleccionado.nombre,
                    precio_unitario: prodSeleccionado.precio_venta,
                    stockDisponible: prodSeleccionado.stock,
                    cantidad_venta: 1,
                });

            } else{
                setCurrentProduct({
                    producto_id: '',
                    nombre: '',
                    cantidad_venta: 1,
                    precio_unitario: 0,
                    stockDisponible: 0
                });
            }
        } else{
            setCurrentProduct(prev =>({
                ...prev,
                [name]: val
            }));
        }
    };

    const handleAddProduct = (e) =>{
        e.preventDefault();
        setError('');

        if (!currentProduct.producto_id){
            setError('Por favor, selecciona un producto.');
            return;
        }

        if (currentProduct.cantidad_venta <= 0){
            setError('La cantidad de venta debe ser mayor a 0.');
            return;
        }

        if (currentProduct.cantidad_venta > currentProduct.stockDisponible){
            setError(`Stock insuficiente. Solo quedan ${currentProduct.stockDisponible} unidades.`);
            return;
        }

        const existeIndex = detalles.findIndex(item => item.producto_id === currentProduct.producto_id);
        if (existeIndex !== -1){
            const nuevosDetalles = [...detalles];
            const nuevaCantidad = nuevosDetalles[existeIndex].cantidad_venta + currentProduct.cantidad_venta;

            if (nuevaCantidad > currentProduct.stockDisponible){
                setError(`No puedes agregar más de ${currentProduct.stockDisponible} unidades de este producto`);
                return;
            }

            nuevosDetalles[existeIndex].cantidad_venta = nuevaCantidad;
            setDetalles(nuevosDetalles);
        } else{
            setDetalles([
                ...detalles,
                {
                    producto_id: currentProduct.producto_id,
                    nombre: currentProduct.nombre,
                    cantidad_venta: currentProduct.cantidad_venta,
                    precio_unitario: currentProduct.precio_unitario
                }
            ]);
        }

        setCurrentProduct({
            producto_id: '',
            nombre: '',
            cantidad_venta: 1,
            precio_unitario: 0,
            stockDisponible: 0
        })
    };


    const handleRemoveProduct = (id) =>{
        setDetalles(detalles.filter(item => item.producto_id !== id));
    };

    const calcularTotalGeneral = () =>{
        return detalles.reduce((sum, item) => sum + (item.cantidad_venta * item.precio_unitario), 0);
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!rut){
            setError('El RUT del cliente es obligatorio');
            setLoading(false);
            return;
        }

        if (detalles.length === 0) {
            setError('Debes agregar al menos un producto al detalle de la venta');
            setLoading(false);
            return;
        }

        const payload = {
            rut: rut,
            detalles: detalles.map(item => ({
                producto_id: item.producto_id,
                cantidad_venta: item.cantidad_venta,
                precio_unitario: item.precio_unitario
            }))
        };

        try{
            const response = await fetch('/api/sales',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al registrar la venta');
            }

            setSuccess('Venta Registrada con éxito');

            setRut('');
            setDetalles([]);
            setCurrentProduct({
                producto_id: '',
                nombre: '',
                cantidad_venta: 1,
                precio_unitario: 0,
                stockDisponible: 0
            });
        
        } catch (error){
            setError(error.message);
        } finally {
            setLoading(false)
        }
    };


    return(
        <>
        <div className="CreateSales-Contenedor">
            <h2>Registrar Nueva Venta</h2>

            {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
        
            <form onSubmit={handleSubmit}>
                <div>
                    <label id="Rut">RUT Cliente:</label>
                    <input 
                    type="text"
                    id="Rut"
                    name="rut"
                    onChange={(e) => setRut(e.target.value)}
                    value={rut}
                    placeholder="Ej: 12345678-9"
                    required
                    />
                </div>

                <hr style={{margin: '20px 0', border: '1px solid #ccc'}}/>
                <h3>Agregar Productos</h3>

                <div>
                    <label htmlFor="Producto">Producto:</label>
                    <select
                        id="Producto"
                        name="producto_id"
                        value={currentProduct.producto_id}
                        onChange={handleProductChange}
                    >
                        <option value="">-- Selecciona un Producto --</option>
                        {productos.map(p => (
                            <option key={p.producto_id} value={p.producto_id}>
                                {p.nombre} ({p.marca}) - Stock: {p.stock}
                            </option>
                        ))}
                    </select>
                </div>

                {currentProduct.producto_id && (
                    <div style={{display: 'flex', gap: '15px', marginTop: '10px'}}>
                        <div>
                            <label>Precio Unitario:</label>
                            <input 
                                type="text" 
                                value={`$${currentProduct.precio_unitario}`} 
                                disabled 
                            />
                        </div>
                        <div>
                            <label htmlFor="Cantidad">Cantidad:</label>
                            <input 
                                type="number" 
                                id="Cantidad"
                                name="cantidad_venta"
                                value={currentProduct.cantidad_venta}
                                onChange={handleProductChange}
                                min="1"
                                max={currentProduct.stockDisponible}
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAddProduct}
                            style={{alignSelf: 'flex-end', padding: '8px 15px'}}
                        >
                            Agregar al Detalle
                        </button>
                    </div>
                )}

                <hr style={{margin: '20px 0', border: '1px solid #ccc'}}/>

                {detalles.length > 0 && (
                    <div>
                        <h3>Detalle de la Venta</h3>
                        <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '20px', textAlign: 'left'}}>
                            <thead>
                                <tr style={{borderBottom: '2px solid #ddd'}}>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Subtotal</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map(item => (
                                    <tr key={item.producto_id} style={{borderBottom: '1px solid #eee'}}>
                                        <td>{item.nombre}</td>
                                        <td>{item.cantidad_venta}</td>
                                        <td>${item.precio_unitario}</td>
                                        <td>${item.cantidad_venta * item.precio_unitario}</td>
                                        <td>
                                            <button 
                                                type="button" 
                                                style={{background: 'red', color: 'white', padding: '3px 8px', border: 'none', cursor: 'pointer'}} 
                                                onClick={() => handleRemoveProduct(item.producto_id)}
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h4 style={{textAlign: 'right', marginRight: '10px'}}>
                            Total General: ${calcularTotalGeneral()}
                        </h4>
                    </div>
                )}

                <button type="submit" disabled={loading} style={{marginTop: '15px', width: '100%'}}>
                    {loading ? 'Registrando Venta...' : 'Confirmar y Registrar Venta'}
                </button>

            </form>
        
        </div>
        </>
    )

}

export default CreateSales;