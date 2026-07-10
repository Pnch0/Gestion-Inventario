import {supabase, supabaseAdmin} from "../Services/supabase.js";

export const CreateSale = async (req, res) => {
    const { rut, detalles } = req.body;

    if (!rut || !detalles || detalles.length === 0) {
        return res.status(400).json({ error: "Datos de venta incompletos " });
    }

    try {
        const total_general = detalles.reduce((sum, item) => sum + (item.cantidad_venta * item.precio_unitario), 0);

        const { data: nuevaVenta, error: errorVenta } = await supabase
            .from('Ventas')
            .insert({
                rut,
                fecha_hora: new Date(),
                total_general
            }).select()
            .single();

        if (errorVenta || !nuevaVenta) {
            throw new Error("No se pudo crear la cabecera de la venta: " + (errorVenta?.message || "Datos vacíos"));
        }

        const id_venta = nuevaVenta.id_venta;
        console.log("ID de venta generado exitosamente:", id_venta);

        for (const item of detalles) {
            const total_linea = item.cantidad_venta * item.precio_unitario;
        
            const { error: errorDetalle } = await supabase
                .from('Detalle_Venta')
                .insert({
                    id_venta,
                    producto_id: item.producto_id,
                    cantidad_venta: item.cantidad_venta,
                    precio_unitario: item.precio_unitario,
                    total_linea
                });

            if (errorDetalle) {
                throw new Error(`Error en el detalle: ${errorDetalle.message}`);
            }

            const { data: producto, error: errorProducto } = await supabase
                .from('Productos')
                .select('stock')
                .eq('producto_id', item.producto_id)
                .single();

            if (errorProducto || !producto) {
                throw new Error(`No se pudo encontrar el producto con ID: ${item.producto_id}`);
            }

            if (producto.stock < item.cantidad_venta) {
                throw new Error(`Stock insuficiente para el producto ID: ${item.producto_id}. Disponible: ${producto.stock}`);
            }

            const { error: errorUpdate } = await supabase
                .from('Productos')
                .update({ stock: producto.stock - item.cantidad_venta })
                .eq('producto_id', item.producto_id);

            if (errorUpdate) {
                throw new Error(`No se pudo actualizar el stock del producto ${item.producto_id}`);
            }
        }

        res.status(201).json({ mensaje: "Venta registrada con exito", id_venta });
    
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la venta", detalle: error.message });
    }
};


export const GetSale = async (req, res) => {
  try {
      const { data: ventas, error } = await supabase
          .from('Ventas')
          .select(`
              id_venta,
              fecha_hora,
              total_general,
              rut,
              Detalle_Venta (
                  id_detalle,
                  producto_id,
                  cantidad_venta,
                  precio_unitario,
                  total_linea
              )
          `)
          .order('fecha_hora', { ascending: false });

      if (error) {
          throw new Error(error.message);
      }

      res.json(ventas);

  } catch (error) {
      res.status(500).json({ error: "Error al obtener las ventas", detalle: error.message });
  }
};

export const GetSaleDetail = async(req , res) =>{
    const { id } = req.params;
    try{
        const { data: detalles, error } = await supabase
        .from('Detalle_Venta')
        .select(`
            id_detalle,
            cantidad_venta,
            precio_unitario,
            total_linea,
            Productos ( producto_id, nombre )
            `)
            .eq('id_venta', id);

        res.json(detalles)
    
    } catch(error){
        res.status(500).json({ error: "Error al obtener el detalle de la venta" })
    }
};