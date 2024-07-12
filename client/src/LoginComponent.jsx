import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// eslint-disable-next-line react/prop-types
export default function LoginComponent({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedInLocally, setIsLoggedInLocally] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
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
      localStorage.setItem('token', data.token);
      setIsLoggedInLocally(true);
      setIsLoggedIn(true);
    } catch (error) {
      setError(error.message);
      console.error(error);
      toast.error(error.message);

    }
  };

  if (isLoggedInLocally) {
    return <Navigate to="/dashboard" />;
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            </div>

              <div>
              <label htmlFor="password" className="Principal block text-sm font-medium leading-6 text-gray-900">
               Contraseña
               </label>
                <div className="mt-2 border_principal rounded-md">
                 <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm leading-6 Principal">
                    Recuerdame
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a href="#" className="font-semibold Secundario text-sm">
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
