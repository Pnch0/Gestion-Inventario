import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './LoginPage.css';


function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verPassword, setVerPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [alerta, setAlerta] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setCargando(true);
        setAlerta(null);

        console.log("Enviando datos: ", { email, password });

        try{
            const data = await LoginService.login({ email, password });

            console.log("Sesion inciada con éxito: ", data);

            if (data.token){
                localStorage.setItem('token', data.token);
            }

            if (data.user) {
                localStorage.setItem('usuario', JSON.stringify(data.user));
            }

            setAlerta({
                titulo: '¡Inicio de Sesión Exitoso!',
                texto: `¡Bienvenido de vuelta, ${data.user?.email || 'usuario'}! Redirigiendo a la página principal...`,
                tipo: 'exito'
            });

            setTimeout(() => {
                navigate('/main-page');
            }, 2000);
        
        } catch (error){
            console.error("Error al iniciar sesión: ", error);

            setAlerta({
                titulo: 'Error de Autenticación',
                texto: error.message || 'Las credenciales ingresadas son incorrectas.',
                tipo: 'error'
            });
        
        } finally{
            setCargando(false);
        }
    }

    return(
        <>
        <div className="Contenedor-Login">
            <div className="ContenedorLogin-Izquierda">
                <div className="ContenedorLogin-Texto">
                    <h1>Login</h1>
                </div>
                <div className="ContenedorLogin-Formulario">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="Email">Email: </label>
                        <input 
                        type="email"
                        id="Email"
                        placeholder="ejemplocorreo@gmail.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="Password">Password: </label>
                        <div className="Contenedor-Input-Password">
                            <input 
                                id='Password'
                                type={verPassword ? "text" : "password"} 
                                placeholder='**********' 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button" 
                                className="Boton-Ver-Password"
                                onClick={() => setVerPassword(!verPassword)}
                            >
                                {verPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>

                        <button type='submit' className="Boton-Submit" disabled={cargando}>
                            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="ContenedorLogin-Derecha">

            </div>
        </div>
        </>
    )
}


export default LoginPage;