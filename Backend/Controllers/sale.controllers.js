import {supabase, supabaseAdmin} from "../Services/supabase.js";

export const CreateSale = async (req, res) =>{
    const { rut, detalles } = req.body;


    if(!rut || !detalles || detalles.length === 0){
        return res.status(400).json({ error: "Datos de venta incompletos "});
    }

    try{
        const total_general = detalles.reduce(( sum, item) => sum + (item.cantidad_venta * item.precio_unitario), 0);

        const nuevaVenta = await db.from('Ventas').insert({
            rut,
            fecha_hora: new Date(),
            total_general
        }).select().single();

        const id_venta = nuevaVenta.id_venta;

        for (const item of detalles){
            const total_linea = item.cantidad_venta * item.precio_unitario;
        
            await db.from('Detalle_Venta').insert({
                id_venta,
                producto_id: item.producto_id,
                cantidad_venta: item.cantidad_venta,
                precio_unitario: item.precio_unitario,
                total_linea
            });

            const producto = await db.from('Productos').select('stock').eq('id', item.producto_id).single();
            if (producto.stock < item.cantidad_venta){
                throw new Error(`Stock insuficiente para el producto ID: ${item.producto_id}`)
            }

            await db.from('Productos')
            .update({ stock: producto.stock - item.cantidad_venta })
            .eq('id', item_producto_id);
        }

        res.status(201).json({ mensaje: "Venta registrada con exito", id_venta});
    
    } catch(error){
        res.status(500).json({ error: "Error al registrar la venta", detalle: error.message});
    }
};


export const GetSale = async(req, res) =>{
    try{
        const ventas = await db.from('Ventas')
        .select(`
            id_venta,
            fecha_hora,
            total_general,
            Usuarios (rut, nombre)
        `)
        .order('fecha_hora', { ascending: false });

        res.json(ventas);
    
    } catch (error){
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
};

export const GetSaleDetail = async(req , res) =>{
    const { id } = req.params;
    try{
        const detalles = await db.from('Detalle_Venta')
        .select(`
            id_detalle,
            cantidad_venta,
            precio_unitario,
            total_linea,
            Productos (id, nombre)
            `)
            .eq('id_venta', id);

        res.json(detalles)
    
    } catch(error){
        res.status(500).json({ error: "Error al obtener el detalle de la venta" })
    }
};