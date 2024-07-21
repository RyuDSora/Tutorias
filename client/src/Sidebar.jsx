import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <Nav className="col-md-3 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <Nav.Item>
          <Nav.Link href="#">Dashboard</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#">Cursos</Nav.Link>
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