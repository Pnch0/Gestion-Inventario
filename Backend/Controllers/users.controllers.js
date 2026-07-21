import {supabase, supabaseAdmin} from "../Services/supabase.js";


const validarRutChileno = (rut) => {
    const rutLimpio = rut.replace(/\./g, '');
    if (!/^[0-9]+[-|‐][0-9kK]{1}$/.test(rutLimpio)) return false;
    
    let [num, dv] = rutLimpio.split('-');
    return num.length >= 7; 
};


export const CreateUser = async(req, res) =>{
    const {rut, rol_id, nombre, apellido, correo, telefono, contraseña} = req.body;

    if (!correo || !contraseña || !rut) {
        return res.status(400).json({ error: "Correo, contraseña y RUT son obligatorios." });
    }

    if(!validarRutChileno(rut)){
        return res.status(400).json({ error: "El RUT ingresado no es valido "});
    }

    let userId = null;

    try{
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: correo,
            password: contraseña
        });

        if (authError) throw authError;

        userId = authData.user?.id;

        if (userId){
            const { data, error: dbError} = await supabase
                .from('Usuario')
                .insert([
                    {
                        id_auth: userId,
                        rut: rut,
                        rol_id: rol_id,
                        nombre: nombre,
                        apellido: apellido,
                        correo: correo,
                        telefono: telefono
                    }
                ])
                .select();

            if (dbError){
                console.error("Error de DB detectado: ", dbError);
                throw dbError;
            }

            return res.status(201).json({
                message: "Usuario creado con exito en ambos sistemas",
                usuario: data[0]
            });
        }
    } catch (error) {
        console.error("Error detectado en el proceso de registro: ", error.message);
        if (userId && supabaseAdmin) {
            try {
                console.log(`Eliminando usuario ${userId} de Auth por fallo en la base de datos...`);
                await supabaseAdmin.auth.admin.deleteUser(userId);
            } catch (adminError) {
                console.error("No se pudo limpiar el usuario de Auth de forma automática:", adminError.message);
            }
        }

        return res.status(500).json({ 
            error: "Hubo un problema al registrar al usuario.", 
            detalles: error.message 
        });
    }
};


export const GetUser = async(req, res) => {
    try{
        console.log("Consultando a Supabase....");
        const { data, error } = await supabase
        .from('Usuario')
        .select(`
            id_auth,
            rut,
            nombre,
            apellido,
            correo,
            telefono,
            rol_id,
            Rol:rol_id ( nombre )
            `);

        if(error){
            console.error("Error de Supabase: ", error.message);
            return res.status(400).json({ error: error.message });
        }

        const usuariosFormateados = data.map(user => ({
            ...user,
            nombre_rol: user.Rol?.nombre || user.Rol?.[0]?.nombre || 'Sin Rol'
        }));

        console.log("Usuarios obtenidos con exito");
        res.json(usuariosFormateados);
    
    } catch(error){
        console.error("Error critico en el servidor", error);

        if (!res.headersSent){
            res.status(500).json({ message: "Error interno"});
        }

    }
};


export const UpdateUser = async(req, res) =>{
    const { id } = req.params;
    const { nombre, rut, apellido, correo, telefono, rol_id } = req.body;

    if(rut && !validarRutChileno(rut)){
        return res.status(400).json({ error: "El RUT ingresado no es válido"});
    }

    try{
        if (correo){
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
                id.trim(),
                { email: correo }
            );

            if (authError){
                console.error("Error en Auth: ", authError.message);
                return res.status(400).json({ error: "No se pudo actulizar el acceso: " + authError.message });
            }
        }

        const updateData = { nombre, rut, apellido, correo, telefono };
        
        if (rol_id !== undefined){
            updateData.rol_id = rol_id;
        }

        const { data, error: dbError } = await supabaseAdmin
        .from('Usuario')
        .update(updateData)
        .eq('id_auth', id.trim())
        .select();

        if (dbError) throw dbError;

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado en la base de datos"});
        }

        res.json({
            message: "Usuario actualizado con exito en Auth y base de datos",
            usuario: data[0]
        });

    } catch(error){
        console.log("Error en UpdateUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
};


export const DeleteUser = async(req, res) =>{
    const id = req.params.id.trim();

    try{
        const { error: dbError } = await supabaseAdmin
            .from('Usuario')
            .delete()
            .eq('id_auth', id);

        if (dbError) {
            console.error("Error al eliminar en la Base de Datos: ", dbError.message);
            return res.status(400).json({ error: "No se pudo eliminar el registro del usuario", detalle: dbError.message });
        }

        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (authError){
            console.error("Fallo critico en Auth", authError.message);
            return res.status(400).json({
                error: "No se pudo eliminar el usuario",
                detalle: authError.message
            });
        }

        res.json({ message: "Usuario y todos sus datos relacionados eliminados con exito" });
    
    } catch (error){
        res.status(500).json({ error: error.message });
    }
};

export const LoginUser = async(req, res) =>{
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ error: "El correo y la contraseña son obligatorios."});
    }

    try{
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error("Detalle error Supabase Auth:", authError.message, authError.status);
            return res.status(401).json({ 
                error: "Credenciales inválidas.", 
                detalle: authError.message 
            });
        }

        const userId = authData.user?.id;

        const { data: usuarioTabla, error: dbError } = await supabase
            .from('Usuario')
            .select(`
                id_auth,
                rut,
                nombre,
                apellido,
                correo,
                telefono,
                rol_id,
                Rol:rol_id ( nombre )
            `)
            .eq('id_auth', userId)
            .single();

        if (dbError){
            console.error("Error al consultar la tabla Usuario: ", dbError.message);
        }

        const perfilCompleto = usuarioTabla ? {
            ...usuarioTabla,
            nombre_rol: usuarioTabla.Rol?.nombre || usuarioTabla.Rol?.[0]?.nombre || 'Sin Rol'
        } : null;

        return res.json({
            message: "Inicio de sesión exitoso",
            token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            user: {
                id: authData.user.id,
                email: authData.user.email,
                perfil: perfilCompleto
            }
        });

    } catch (error){
        console.error("Error en LoginUser: ", error);
        return res.status(500).json({ error: "Error interno del servidor al intentar iniciar sesion. "})
    }
};


export const LogoutUser = async (req, res) =>{
    try{
        const { error } = await supabase.auth.signOut();

        if (error){
            return res.status(400).json({ error: "Errro al cerrar sessión", detalle: error.message });
        }

        return res.json({ message: "Sesión cerrada correctamente" })
    
    } catch (error){
        console.error("Error en LogoutUser:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
};