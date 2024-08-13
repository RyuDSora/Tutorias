import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { encryptionKey, encryptValue, decryptValue } from './hashes';
import Cookies from 'js-cookie';

import { urilogin } from './Urls'


// eslint-disable-next-line react/prop-types
export default function LoginComponent({ setIsLoggedIn }) {

  //  const [urilogin, seturilogin] = useState('http://localhost:3000/users/login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedInLocally, setIsLoggedInLocally] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(urilogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Correo electrónico o contraseña incorrectos');
      }

      const data = await response.json();
      console.log(data);  // Imprimir para debug

      if (data && data.user) {
        const name = data.user.name || '';
        const last = data.user.last || '';
        const id = data.user.id || '';
        const role = data.user.role || '';
        const imagenPerfil = data.user.imagen_perfil || ''; // Asegúrate de que existe

        console.log("Valores a cifrar:", {
          username: `${name} ${last}`,
          useid: id,
          userrole: role,
          userimagen: imagenPerfil,
        });

        // Declarar las variables
        const username = encryptValue(`${name} ${last}`, encryptionKey);
        const useid = encryptValue(id, encryptionKey);
        const userrole = encryptValue(role, encryptionKey);
        const userimagen = encryptValue(imagenPerfil, encryptionKey);

        if (rememberMe) {
          Cookies.set('1m@&34', userimagen, { expires: 30 }) // Imagen
          Cookies.set('#gt156', useid, { expires: 30 });     // ID
          Cookies.set('&0l3', userrole, { expires: 30 });    // Role
          Cookies.set('@u53r', username, { expires: 30 });   // Nombre
          Cookies.set('$3s1.4', encryptValue(true, encryptionKey), { expires: 30 }); // Sesión
        } else {
          Cookies.set('1m@&34', userimagen); // Imagen
          Cookies.set('#gt156', useid);     // ID
          Cookies.set('&0l3', userrole); // Role
          Cookies.set('@u53r', username); // Nombre
          Cookies.set('$3s1.4', encryptValue(true, encryptionKey)); // Sesión
        }

        localStorage.setItem('token', data.token);
        setIsLoggedInLocally(true);
        setIsLoggedIn(true);
      } else {
        throw new Error('Usuario no encontrado en la respuesta del servidor.');
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
      toast.error(error.message);
    }
  };

  if (isLoggedInLocally) {
    if (Cookies.get('$3s1.4')) {
      const session = decryptValue(Cookies.get('$3s1.4'), encryptionKey)
      if (session) {
        const role = decryptValue(Cookies.get('&0l3'), encryptionKey)
        if (role === 'administrador') {
          window.location.href = '/dashboardadmin/sql';
        }
        if (role === 'tutor') {
          window.location.href = '/dashboardtutor/dash';
        }
        if (role === 'estudiante') {
          window.location.href = '/dashboardStudent/dashst';
        }
      }
    }
  }

  return (
    <>
      <ToastContainer />

      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] border_principal  rounded-lg">
          <div className=" px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 mb-6 text-center text-2xl Principal leading-9 tracking-tight">
                Iniciar sesión
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="Principal block text-sm font-medium leading-6">
                  Correo electrónico
                </label>
                <div className="mt-2 border border_principal rounded-md">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md  py-1.5  shadow-sm  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="Principal block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
                <div className="mt-2 border border_principal rounded-md">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md  py-1.5  shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border_principal "
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm leading-6 Principal">
                    Recuerdame
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a href="/reset-password-request" className="font-semibold Secundario text-sm">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg_secundario px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar sesión
                </button>
              </div>
              <div><span className='Principal'>¿No tienes cuenta? <a href="/Signup" className="font-semibold Secundario text-sm"><span>Regístrate</span></a></span></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
