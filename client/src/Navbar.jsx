import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Dropdown} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HiUserCircle } from 'react-icons/hi';

import SearchComponent from './SearchComponent'; // Asegúrate de que la ruta sea correcta

function Navbar({ isLoggedIn, handleLogout }) {
  
  const navigate = useNavigate();
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [Admin, setAdmin] = useState(false);
  
  const [UserL, setUserL] = useState('');

  useEffect(() => {
    if (Cookies.get('session')) {
      setUserL(Cookies.get('User'));  
    }
  }, []);
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };


  return (
    <>
      <nav className="bg_blanco f_regular mx-auto flex justify-between max-w-7xl items-center gap-x-6 lg:px-8" aria-label="Global">
        <Link to="/dashboard" className="flex items-center gap-x-4">
          <img className="h-16 w-auto" src="./logos/logo.jpg" alt="logo" />          
        </Link>
        <div className="flex gap-x-6 items-center">
            <Link to="/tutores" className='Principal f_principal'>
              Tutores
            </Link>
            <Link to="/cursos" className='Principal f_principal'>
              Cursos
            </Link>
            {isLoggedIn ? (
          <div className="flex gap-x-6 items-center">
            <button
              onClick={toggleSearch}
              className="Principal f_principal lg:block"
            >
              Buscar
            </button>
            <Link to="/account" className="Principal f_principal">
              <HiUserCircle className="inline-block mr-1 h-7 w-7" /> {UserL}
            </Link>
            
            <Dropdown>
  <Dropdown.Toggle id="dropdown-basic" className="btn-light">
    
  </Dropdown.Toggle>
  <Dropdown.Menu>
    <div style={{ marginLeft: '-10px' }}>
      
      {Admin ? (
        <>
        </>
      ) : (
        <>
          <Dropdown.Item onClick={() => navigate(`/cursos`)} className="mx-3">Mis Cursos</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(`/ss`)} className="mx-3">Mis Solicitudes</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(`/xd`)} className="mx-3">Mis XD</Dropdown.Item>
        </>
      )}
      <Dropdown.Item onClick={handleLogout} className="mx-3">Cerrar Sesión</Dropdown.Item>
    </div>
  </Dropdown.Menu>
</Dropdown>
          </div>
        ) : (
          
          <div className="flex gap-x-6 items-center">
            <Link to="/login" className='Principal f_principal'>
              Iniciar Sesión
            </Link>
            <Link
              to="/signup"
              className='Principal f_principal'
            >
              Registrarse
            </Link>
          </div>
        )}
        </div >
      </nav>
      <div className='bg_principal rect'></div>
      <SearchComponent isOpen={isSearchOpen} closeSearch={() => setIsSearchOpen(false)} />
    </>
  );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Navbar;
