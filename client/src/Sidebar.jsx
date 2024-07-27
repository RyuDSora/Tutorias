import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaUsers, FaComments, FaFileAlt } from 'react-icons/fa'; // Importing icons from react-icons

const Sidebar = () => {
  return (
    <div className=''>
      <Nav className="d-md-block sidebar Secundario p-3">
      <div className="sidebar-sticky">
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardtutor/dash" className="d-flex align-items-center">
                <FaHome className="icon Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">Dashboard</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardtutor/my-courses" className="d-flex align-items-center">
                <FaBook className="icon Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">Cursos</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardtutor/my-students" className="d-flex align-items-center">
                <FaUsers className="icon Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">Estudiantes</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardtutor/chats" className="d-flex align-items-center">
                <FaComments className="icon Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">Chats</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardtutor/articles" className="d-flex align-items-center">
                <FaFileAlt className="icon Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">Artículos</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
      </div>
    </Nav>
    </div>
  );
}

export default Sidebar;
