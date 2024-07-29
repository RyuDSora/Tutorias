import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTable, FaComments, FaTerminal} from 'react-icons/fa'; 

const SidebarAdmin = () => {
  return (
    <div className=''>
      <Nav className="d-md-block sidebar Secundario p-3">
      <div className="sidebar-sticky">
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardadmin/sql" className="d-flex align-items-center px-0">
                <FaTerminal className="icon Secundario " style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">SQL</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardadmin/tables" className="d-flex align-items-center px-0">
                <FaTable className="icon Secundario" style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">Tablas</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
        <Nav.Item>
          <Card>
            <Card.Body className="p-0">
              <Nav.Link as={Link} to="/dashboardadmin/chats" className="d-flex align-items-center px-0">
                <FaComments className="icon Secundario " style={{ width: 20, height: 20 }} />
                <span className="d-none d-md-inline small ms-3">Chats</span>
              </Nav.Link>
            </Card.Body>
          </Card>
        </Nav.Item>
      </div>
    </Nav>
    </div>
  );
}

export default SidebarAdmin;
