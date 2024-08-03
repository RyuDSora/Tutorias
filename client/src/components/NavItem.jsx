import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export const NavItem = ({ url, icon: Icon, etiqueta }) => {
    return (
      <Nav.Item className='mb-2'>
        <Card>
          <Card.Body className="py-0 px-3">
            <Nav.Link as={Link} to={url} className="d-flex align-items-center px-0">
              <Icon className="icon Secundario" style={{ width: 20, height: 20 }} />
              <span className="d-none d-md-inline small ms-3">{etiqueta}</span>
            </Nav.Link>
          </Card.Body>
        </Card>
      </Nav.Item>
    );
};