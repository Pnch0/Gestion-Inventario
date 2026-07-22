import './UsersPage.css';
import { FaRegUserCircle, FaSearch  } from "react-icons/fa";

function UsersPage(){

    return(
        <>
        <div className="Contenedor-UsersPage">
            <div className="ContenedorSuperior-UsersPage">
                <button className='Boton-Funcion'>Agregar Usuario</button>
                <button className='Boton-Usuario'><FaRegUserCircle className='Icono-Perfil'/></button>
            </div>

            <div className="ContenedorListado-UsersPage">
                <div className="ContenedorSuperior-ListadoUsuarios">
                    <div className="ContenedorSuperior-IzquierdaUsuarios">
                        <h2>Listado Usuarios</h2>
                    </div>
                    <div className="ContenedorSuperior-DerechaUsuarios">
                        <div className="Buscador-Usuarios">
                            <FaSearch className="Icono-Buscador" />
                            <input type="text" placeholder="Buscar usuario..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        </>
    )
}

export default UsersPage;
