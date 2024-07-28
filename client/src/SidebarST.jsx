import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaUsers, FaComments, FaFileAlt } from 'react-icons/fa'; // Importing icons from react-icons

const SidebarST = () => {
  return (
    <Nav className="d-md-block sidebar Secundario p-3">
      <div className="sidebar-sticky">
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/dashst" className="d-flex align-items-center px-0">
                <FaHome className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Dashboard</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/my-coursesST" className="d-flex align-items-center px-0">
                <FaBook className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Cursos</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/my-tutor" className="d-flex align-items-center px-0">
                <FaUsers className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Tutores</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/chatsST" className="d-flex align-items-center px-0">
                <FaComments className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Chats</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/articlesST" className="d-flex align-items-center px-0">
                <FaFileAlt className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Libros</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
      </div>
    </Nav>
  );
}

export default SidebarST;
