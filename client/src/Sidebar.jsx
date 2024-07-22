import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importar Link para navegación interna

const Sidebar = () => {
  return (
    <Nav className="d-none d-md-block sidebar my-2 py-2 w-75 mx-auto">
      <div className="sidebar-sticky">
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboardtutor/dash">Dashboard</Nav.Link> {/* Ruta principal del DashboardTutor */}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboardtutor/my-courses">Mis Cursos</Nav.Link> {/* Ruta para "Mis Cursos" */}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboardtutor/my-students">Estudiantes</Nav.Link> {/* Ruta para "Estudiantes" */}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboardtutor/chats">Chats</Nav.Link> {/* Ruta para "Chats" */}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboardtutor/articles">Articles</Nav.Link> {/* Ruta para "Articles" */}
        </Nav.Item>
      </div>
    </Nav>
  );
}

export default Sidebar;
