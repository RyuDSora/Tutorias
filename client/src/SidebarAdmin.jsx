import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaTable, FaComments, FaTerminal} from 'react-icons/fa';
import { NavItem } from './NavItem'; 

const SidebarAdmin = () => {
  return (
    <div className=''>
      <Nav className="d-md-block sidebar Secundario py-3">
        <div className="sidebar-sticky">
          <NavItem url="/dashboardadmin/sql" icon={FaTerminal} etiqueta="SQL" />
          <NavItem url="/dashboardadmin/tables" icon={FaTable} etiqueta="Tablas" />
          <NavItem url="/dashboardadmin/chats" icon={FaComments} etiqueta="Chats" />
        </div>
      </Nav>
    </div>
  );
}

export default SidebarAdmin;
