import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Cookies from 'js-cookie';
import { encryptionKey, decryptValue } from './hashes';
import { FaUser, FaTable, FaSignOutAlt, FaHome, FaBook, FaUsers, FaComments, FaFileAlt, FaTerminal } from "react-icons/fa";
import { HiUserCircle } from 'react-icons/hi';

function NavBarT({ isLoggedIn }) {
  const pre = '/images/'
  const [Admin, setAdmin] = useState(false);
  const [Tutor, setTutor] = useState(false);
  const [User, setUser] = useState(false);
  const [UserL, setUserL] = useState('');
  const [UserI,setUserI]= useState('');

  //verificacion de sesion activa para verificar el role del usuario logueado
  useEffect(() => {
    if(Cookies.get('$3s1.4')){
      const session = decryptValue(Cookies.get('$3s1.4'),encryptionKey)
      if (session) {
        const role = decryptValue(Cookies.get('&0l3'),encryptionKey)
        setUserL(decryptValue(Cookies.get('@u53r'),encryptionKey) || '');
        setUserI(decryptValue(Cookies.get('1m@&34'),encryptionKey))
        if (role === 'administrador') {
          setAdmin(true);
        }
        if (role === 'tutor') {
          setTutor(true);
        }
        if (role === 'estudiante') {
          setUser(true);
        }
      }
    }
  }, []);


  //funcion para cerrar sesion
  const handleLogout = () => {
    localStorage.removeItem('token');
    Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));
    window.location.href = '/dashboard';
  };

  return (
    <>
      <Navbar bg="bg_blanco" expand="lg">
        <Container>
          <Navbar.Brand href="/dashboard">
            <img className="h-16 w-auto" src="/logos/logo.jpg" alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
            <Nav className="Principal">
              <Nav.Link href="/tutores" className='Principal'>Tutores</Nav.Link>
              <Nav.Link href="/cursos" className='Principal'>Cursos</Nav.Link>
              <Nav.Link href="/suscripciones" className='Principal'>Suscripciones</Nav.Link>

              {/**Verificar si esta logueado*/}
              {isLoggedIn ? (
              <NavDropdown title={UserI!=='' ? (
                                <>
                                  <img src={pre+UserI} alt={UserI} className='inline-block mr-1 h-7 w-7'/>
                                  <span className='mx-2 Principal'>{UserL}</span>
                                </>):(
                                <>
                                  <HiUserCircle className="inline-block mr-1 h-7 w-7" />
                                  <span className='mx-2 Principal'>{UserL}</span>
                                </>
                                )} id="basic-nav-dropdown">
                <NavDropdown.Item href="/account" className='Principal'>
                  <div className='d-flex align-items-center'>
                    <span  className='Principal me-2'><FaUser /></span>
                    <span  className='Principal'>Mi Perfil</span>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {Admin ? (<>
                {/**aqui van las opcines del administrador */}
                  {lista("/dashboardadmin/sql",<FaTerminal />,"SQL")}
                  {lista("/dashboardadmin/tables",<FaTable />,"Tablas")}
                  {lista("/dashboardadmin/chats",<FaComments/>,"Chats")} 
                </>):(
                  <>{Tutor ? (<>
                  {/**aqui van las opciones del tutor */}
                    {lista("/dashboardtutor/dash",<FaHome />,'Mi Panel')}
                    {lista("/dashboardtutor/my-courses",<FaBook />,'Mis Cursos')}
                    {lista("/dashboardtutor/my-students",<FaUsers />,'Mis Estudiantes')}
                    {lista("/dashboardtutor/chats",<FaComments />,'Chats')}
                    {lista("/dashboardtutor/articles",<FaFileAlt />,'Mis Artículos')}
                  </>):(
                      <>{User ? (<>
                      {/**aqui van las opcines del estudiante */}
                        {lista("/dashboardStudent/dashst",<FaHome />,'Mi Panel')}
                        {lista("/dashboardStudent/my-coursesST",<FaBook />,'Mis Cursos')}
                        {lista("/dashboardStudent/my-tutor",<FaUsers />,'Mis Tutores')}
                        {lista("/dashboardStudent/chatsST",<FaComments />,'Chats')}
                        {lista("/dashboardStudent/articlesST",<FaFileAlt />,'Mis Libros')}
                      </>):(<></>)}
                  </>)}
                </>)}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className='Principal'>
                  <div className='d-flex align-items-center'>
                    <span  className='Principal me-2'><FaSignOutAlt /></span>
                    <span  className='Principal'>Cerrar Sesión</span>
                  </div>
                </NavDropdown.Item>
              </NavDropdown>
              ):(<>
                {/**Si no esta logueado mostrara */}
                <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link href="/signup">Registrarse</Nav.Link>
              </>)}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='bg_principal rect'></div>
    </>
  );
}

const lista = (url,icon, nombre) =>{
  return(
    <NavDropdown.Item href={url} className='Principal'>
      <div className='d-flex align-items-center'>
        <span  className='Principal me-2'>{icon}</span>
        <span  className='Principal'>{nombre}</span>
      </div>
    </NavDropdown.Item>
  );
}

NavBarT.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default NavBarT;
