import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Modal, Table, Button, Row, Col } from 'react-bootstrap';
import { URIgetTables } from './Urls';
import { FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function TableList() {
  const [tables, setTables] = useState({});
  const [show, setShow] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(URIgetTables);
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleShow = (tableName) => {
    setSelectedTable(tableName);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <div className="">
      <div className='m-4'><span className='h3 Principal f_principal'>Tablas existentes</span></div>
      <div className="mb-4">
        {Object.keys(tables).length === 0 ? (
          <p>No tables found.</p>
        ) : (
          <Row>
            {Object.keys(tables).map((tableName, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card 
                  className="h-100"
                  onClick={() => handleShow(tableName)} 
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <Card.Title className='Principal'>{tableName}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Modal show={show} onHide={handleClose} size="lg" fullscreen>
        <Modal.Header>
          <Modal.Title>{selectedTable}</Modal.Title>
          <Button variant="close" onClick={handleClose}>
            <span aria-hidden="true"><FaTimes/></span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          {selectedTable && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Column Name</th>
                  <th>Data Type</th>
                  <th>Nullable</th>
                  <th>Primary Key</th>
                </tr>
              </thead>
              <tbody>
                {tables[selectedTable].columns.map((column, index) => (
                  <tr key={index}>
                    <td>{column.column_name}</td>
                    <td>{column.data_type}</td>
                    <td>{column.is_nullable}</td>
                    <td>{column.is_primary_key ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className='bg_negro'>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TableList;
