import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {uriregister} from './components/Urls'

export default function SignUpComponent() {
  //const [urilogin, seturilogin] = useState('http://localhost:3000/users/register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('estudiante'); // Valor por defecto
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== cpassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(uriregister, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, surname, birthDate, role }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      setSuccess(true);
      toast.success('Usuario registrado con éxito');
    } catch (error) {
      setError(error.message);
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] border_principal rounded-lg">
          <div className="px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="txt_lg my-2 text-center Principal f_regular">
                Registrate
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className='row'>
                <div className='col-3 Principal'>
                  <div style={{height:'2.85rem'}} className='d-flex align-items-center'> <span className='small f_principal'>Nombre              </span></div>
                  <div style={{height:'2.85rem'}} className='d-flex align-items-center'> <span className='small f_principal'>Apellido            </span></div>
                  <div style={{height:'2.85rem'}} className='d-flex align-items-center'> <span className='small f_principal'>Fecha de Nacimiento </span></div>
                  <div style={{height:'2.85rem'}} className='d-flex align-items-center'> <span className='small f_principal'>Correo Electronico </span></div>
                  <div style={{height:'2.85rem'}} className='d-flex align-items-center'> <span className='small f_principal'>Contraseña          </span></div>
                  <div style={{height:'2.85rem'}} className='d-flex align-items-center'> <span className='small f_principal'>Confirmar Contraseña</span></div>
                  <div style={{height:'2.85rem'}} className='d-flex align-items-center'> <span className='small f_principal'>Rol                 </span></div>
                </div>
                <div className='col-9'>
                  <div>
                    <input 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      type="text" 
                      autoComplete="name" 
                      name="name" 
                      id="name"  
                      className="form-control block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
                    />
                  </div>
                  <div>
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      autoComplete="surname"
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="form-control block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
                    />
                  </div>
                  <div>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      autoComplete="birthDate"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
                    />
                  </div>
                  <div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
                    />
                  </div>
                  <div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
                    />
                  </div>
                  <div>
                    <input
                      id="cpassword"
                      name="cpassword"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={cpassword}
                      onChange={(e) => setcPassword(e.target.value)}
                      className="block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
                    />
                  </div>
                  <div>
                    <select
                      id="role"
                      name="role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full rounded-md py-1.5 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
                    >
                      <option value="tutor">Tutor</option>
                      <option value="estudiante">Estudiante</option>
                    </select>
                  </div>
              </div>
              </div>



              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg_secundario px-3 py-1.5 text-sm font-semibold leading-6 Blanco f_regular shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Aceptar
                </button>

                <br />
                <br />
                <hr />
                <br />
                <div>loguea con google</div>
                <div>loguea con facebook</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
