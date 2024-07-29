import React from 'react';
import { NavItem } from './NavItem'; 
import { Nav } from 'react-bootstrap';
import { FaHome, FaBook, FaUsers, FaComments, FaFileAlt } from 'react-icons/fa'; // Importing icons from react-icons

const SidebarST = () => {
  return (
    <Nav className="d-md-block sidebar Secundario py-3">
      <div className="sidebar-sticky">
        <NavItem url="/DashboardStudent/dashst" icon={FaHome} etiqueta="Dashboard" />
        <NavItem url="/DashboardStudent/my-coursesST" icon={FaBook} etiqueta="Cursos" />
        <NavItem url="/DashboardStudent/my-tutor" icon={FaUsers} etiqueta="Tutores" />
        <NavItem url="/DashboardStudent/chatsST" icon={FaComments} etiqueta="Chats" />
        <NavItem url="/DashboardStudent/articlesST" icon={FaFileAlt} etiqueta="Libros" />
      </div>
    </Nav>
  );
}

export default SidebarST;
