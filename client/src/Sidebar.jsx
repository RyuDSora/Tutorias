import React from 'react';
import { NavItem } from './NavItem'; 
import { Nav } from 'react-bootstrap';
import { FaHome, FaBook, FaUsers, FaComments, FaFileAlt } from 'react-icons/fa'; 

const Sidebar = () => {
  return (
    <div className=''>
      <Nav className="d-md-block sidebar Secundario py-3">
      <div className="sidebar-sticky">
        <NavItem url="/dashboardtutor/dash" icon={FaHome} etiqueta="Dashboard" />
        <NavItem url="/dashboardtutor/my-courses" icon={FaBook} etiqueta="Cursos" />
        <NavItem url="/dashboardtutor/my-students" icon={FaUsers} etiqueta="Estudiantes" />
        <NavItem url="/dashboardtutor/chats" icon={FaComments} etiqueta="Chats" />
        <NavItem url="/dashboardtutor/articles" icon={FaFileAlt} etiqueta="Artículos" />
      </div>
    </Nav>
    </div>
  );
}

export default Sidebar;