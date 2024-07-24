import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaUsers, FaComments, FaFileAlt } from 'react-icons/fa'; // Importing icons from react-icons

const SidebarST = () => {
  return (
    <Nav className="d-none d-md-block sidebar my-2 py-2 Secundario mt-3">
      <div className="sidebar-sticky">
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/dashst" className="d-flex align-items-center">
                <FaHome className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Dashboard</span>
                <span className="d-inline d-md-none small"><FaHome className="icon" style={{ width: 20, height: 20 }} /></span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/my-coursesST" className="d-flex align-items-center">
                <FaBook className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Cursos</span>
                <span className="d-inline d-md-none small"><FaBook className="icon" style={{ width: 20, height: 20 }} /></span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/my-tutor" className="d-flex align-items-center">
                <FaUsers className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Tutores</span>
                <span className="d-inline d-md-none small"><FaUsers className="icon" style={{ width: 20, height: 20 }} /></span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/chatsST" className="d-flex align-items-center">
                <FaComments className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Chats</span>
                <span className="d-inline d-md-none small"><FaComments className="icon" style={{ width: 20, height: 20 }} /></span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/DashboardStudent/articlesST" className="d-flex align-items-center">
                <FaFileAlt className="icon me-2 Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small">Libros</span>
                <span className="d-inline d-md-none small"><FaFileAlt className="icon" style={{ width: 20, height: 20 }} /></span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
      </div>
    </Nav>
  );
}

export default SidebarST;
