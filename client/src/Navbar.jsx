import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Dropdown } from "react-bootstrap";
import Cookies from 'js-cookie';
import { HiUserCircle } from 'react-icons/hi';
//import SearchComponent from './SearchComponent'; // Asegúrate de que la ruta sea correcta

function Navbar({ isLoggedIn }) {
  const pre = '/images/'
  const navigate = useNavigate();
  const [isEventOpen, setIsEventOpen] = useState(false);
  //const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [Admin, setAdmin] = useState(false);
  const [Tutor, setTutor] = useState(false);
  const [User, setUser] = useState(false);
  const [UserL, setUserL] = useState('');
  const [UserI,setUserI]= useState('');

  //verificacion de sesion activa para verificar el role del usuario logueado
  useEffect(() => {
    const session = Cookies.get('session');
    if (session) {
      setUserL(Cookies.get('User') || '');
      setUserI(Cookies.get('Imagen'))
      if (Cookies.get('UserRol') === 'administrador') {
        setAdmin(true);
      }
      if (Cookies.get('UserRol') === 'tutor') {
        setTutor(true);
      }
      if (Cookies.get('UserRol') === 'estudiante') {
        setUser(true);
      }
    }
  }, []);

 /* const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
  };*/

  //funcion para cerrar sesion
  const handleLogout = () => {
    localStorage.removeItem('token');
    Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));
    window.location.href = '/dashboard';
  };

  return (
    <>
      <nav className="bg_blanco f_regular mx-auto flex justify-between max-w-7xl items-center gap-x-6 lg:px-8 " aria-label="Global">
        <Link to="/dashboard" className="flex items-center gap-x-4">
          <img className="h-16 w-auto" src="/logos/logo.jpg" alt="logo" />
        </Link>
        <div className="flex gap-x-6 items-center">
          <Link to="/tutores" className='Principal f_principal'>
            Tutores
          </Link>
          <Link to="/cursos" className='Principal f_principal'>
            Cursos
          </Link>
          <Link to="/suscripciones" className='Principal f_principal'>
            Suscripciones
          </Link>
          {isLoggedIn ? (
            <div className="flex gap-x-6 items-center">
              {/*<button
                onClick={toggleSearch}
                className="Principal f_principal lg:block"
              >
                Buscar
              </button>*/}
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" className="btn-light Principal">
                  {UserI!=='' ? (<img src={pre+UserI} alt={UserI} className='inline-block mr-1 h-7 w-7'/>):(<HiUserCircle className="inline-block mr-1 h-7 w-7" />)}
                  <span className='mx-2'>{UserL}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className='w-100'>
                  <div style={{ marginLeft: '-10px' }}>
                    <Dropdown.Item onClick={() => navigate(`/account`)} className="ms-3 pe-0" style={{width:'90%'}}>Mi Perfil</Dropdown.Item>
                    {Admin ? (
                      <>
                        {/* Opciones específicas para admin */}
                        <Dropdown.Item onClick={() => navigate(`/tables`)} className="mx-3 pe-0" style={{width:'90%'}}>Tablas</Dropdown.Item>
                      </>
                    ) : (
                      <>
                        {Tutor ? (
                          <>
                            <Dropdown.Item onClick={() => navigate(`/dashboardtutor/dash`)} className="mx-3 pe-0" style={{width:'90%'}}>Mi Panel</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate(`/dashboardtutor/my-courses`)} className="mx-3 pe-0" style={{width:'90%'}}>Mis Cursos</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate(`/dashboardtutor/my-students`)} className="mx-3 pe-0" style={{width:'90%'}}>Mis Estudiantes</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate(`/dashboardtutor/chats`)} className="mx-3 pe-0" style={{width:'90%'}}>Chats</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate(`/dashboardtutor/articles`)} className="mx-3 pe-0" style={{width:'90%'}}>Mis Artículos</Dropdown.Item>
                          </>
                        ) : (
                          <>
                            {User ? (
                              <>
                                <Dropdown.Item onClick={() => navigate(`/dashboardStudent/dashst`)} className="mx-3 pe-0" style={{width:'90%'}}>Mi Panel</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(`/dashboardStudent/my-coursesST`)} className="mx-3 pe-0" style={{width:'90%'}}>Mis Cursos</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(`/dashboardStudent/my-tutor`)} className="mx-3 pe-0" style={{width:'90%'}}>Mis Tutores</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(`/dashboardStudent/chatsST`)} className="mx-3 pe-0" style={{width:'90%'}}>Chats</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(`/dashboardStudent/articlesST`)} className="mx-3 pe-0" style={{width:'90%'}}>Mis Libros</Dropdown.Item>
                              </>
                              
                            ) : (<></>)}
                          </>
                        )}
                      </>
                    )}
                    <Dropdown.Item onClick={handleLogout} className="mx-3 pe-0" style={{width:'90%'}}>Cerrar Sesión</Dropdown.Item>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div className="flex gap-x-6 items-center">
              <Link to="/login" className='Principal f_principal'>
                Iniciar Sesión
              </Link>
              <Link to="/signup" className='Principal f_principal'>
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className='bg_principal rect'></div>
      {/*<SearchComponent isOpen={isSearchOpen} closeSearch={() => setIsSearchOpen(false)} />*/}
    </>
  );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Navbar;
