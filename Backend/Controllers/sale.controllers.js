import {supabase, supabaseAdmin} from "../Services/supabase.js";

export const CreateSale = async (req, res) => {
    const { rut, rut_cliente, rut_vendedor, id_usuario, detalles } = req.body;

    const rutFinalVendedor = rut_vendedor || rut || id_usuario;

    if (!rutFinalVendedor) {
        return res.status(400).json({ error: "No se identificó el vendedor" });
    }

    if (!detalles || detalles.length === 0) {
        return res.status(400).json({ error: "Debe incluir al menos un producto en la venta" });
    }

    try {
        const total_general = detalles.reduce((sum, item) => sum + (item.cantidad_venta * item.precio_unitario), 0);

        const { data: nuevaVenta, error: errorVenta } = await supabase
            .from('Ventas')
            .insert({
                rut: rutFinalVendedor,
                fecha_hora: new Date().toISOString(),
                total_general
            })
            .select()
            .single();

        if (errorVenta || !nuevaVenta) {
            console.error("Error Supabase al insertar Venta:", errorVenta);
            return res.status(400).json({ error: `Error en Venta: ${errorVenta?.message}` });
        }

        const id_venta = nuevaVenta.id_venta;

        for (const item of detalles) {
            const total_linea = item.cantidad_venta * item.precio_unitario;

            const { error: errorDetalle } = await supabase
                .from('Detalle_Venta')
                .insert({
                    id_venta,
                    producto_id: Number(item.producto_id),
                    cantidad_venta: Number(item.cantidad_venta),
                    precio_unitario: Number(item.precio_unitario),
                    total_linea
                });

            if (errorDetalle) {
                return res.status(400).json({ error: `Error en detalle del producto ${item.producto_id}: ${errorDetalle.message}` });
            }

            const { data: producto } = await supabase
                .from('Productos')
                .select('stock')
                .eq('producto_id', item.producto_id)
                .single();

            if (producto) {
                const nuevoStock = producto.stock - item.cantidad_venta;
                await supabase
                    .from('Productos')
                    .update({ stock: nuevoStock >= 0 ? nuevoStock : 0 })
                    .eq('producto_id', item.producto_id);
            }
        }

        return res.status(201).json({ mensaje: "Venta registrada con éxito", id_venta });

    } catch (error) {
        console.error("Error en CreateSale:", error);
        return res.status(500).json({ error: error.message || "Error al procesar la venta" });
    }
};


export const GetSale = async (req, res) => {
  try {
      const db = supabaseAdmin || supabase;

      const { data: ventas, error: errorVentas } = await db
          .from('Ventas')
          .select('id_venta, fecha_hora, total_general, rut')
          .order('fecha_hora', { ascending: false });

      if (errorVentas) throw new Error(errorVentas.message);
      if (!ventas || ventas.length === 0) return res.json([]);

      const { data: usuarios } = await db
          .from('Usuario')
          .select('rut, nombre, apellido');

      const idsVenta = ventas.map(v => v.id_venta);
      const { data: detalles, error: errorDetalles } = await db
          .from('Detalle_Venta')
          .select('*')
          .in('id_venta', idsVenta);

      if (errorDetalles) console.error("Error en Detalle_Venta:", errorDetalles);

      let productosMap = {};

      if (detalles && detalles.length > 0) {
          const idsProductos = [...new Set(detalles.map(d => d.producto_id || d.id_producto))].filter(Boolean);

          const { data: productos, error: errorProductos } = await db
              .from('Productos')
              .select('*')
              .in('producto_id', idsProductos);

          if (errorProductos) {
              console.error("Error al obtener Productos:", errorProductos);
          } else if (productos) {
              productosMap = productos.reduce((acc, p) => {
                  acc[p.producto_id] = {
                      ...p,
                      Categorias: {
                          nombre_categoria: p.categoria || 'Sin Categoría'
                      }
                  };
                  return acc;
              }, {});
          }
      }

      const limpiarRut = (r) => String(r || '').replace(/[^0-9kK]/g, '').toLowerCase();

      const mapaUsuarios = (usuarios || []).reduce((acc, u) => {
          if (u.rut) acc[limpiarRut(u.rut)] = u;
          return acc;
      }, {});

      const ventasCompletas = ventas.map(venta => {
          const usuarioEncontrado = mapaUsuarios[limpiarRut(venta.rut)];

          const detallesDeEstaVenta = (detalles || [])
              .filter(d => Number(d.id_venta) === Number(venta.id_venta))
              .map(d => ({
                  ...d,
                  Productos: productosMap[d.producto_id] || null
              }));

          return {
              ...venta,
              Usuarios: usuarioEncontrado ? {
                  nombre: usuarioEncontrado.nombre,
                  apellido: usuarioEncontrado.apellido
              } : null,
              Detalle_Venta: detallesDeEstaVenta
          };
      });

      return res.json(ventasCompletas);

  } catch (error) {
      console.error("Error en GetSale:", error);
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