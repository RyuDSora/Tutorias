import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <Nav className="d-none d-md-block sidebar my-2 py-2 w-75 mx-auto">
      <div className="sidebar-sticky">
        <Nav.Item>
          <Nav.Link href="#">Dashboard</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/cursos">Cursos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#">Estudiantes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#">Chats</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#">Articles</Nav.Link>
        </Nav.Item>
      </div>
    </Nav>
  );
}

export default Sidebar;
