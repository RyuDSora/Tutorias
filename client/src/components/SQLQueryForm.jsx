import React, { useState } from 'react';
import axios from 'axios';
import { URUsql } from './Urls.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button } from 'react-bootstrap';
import { FaTerminal,FaTimes } from 'react-icons/fa';

function SQLQueryForm() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(URUsql, { sqlQuery });
      setQueryResult(response.data);
      handleShowModal(); // Mostrar el modal con el resultado
    } catch (error) {
      toast.error('Error ejecutando la consulta SQL');
      console.error('Error ejecutando la consulta SQL:', error);
    }
  };

  return (
    <div className="container-fluid my-3">
      <ToastContainer />
      <div className='d-flex align-items-center h3 Principal mb-3'>
          <FaTerminal/> <span className='ms-2'>Ejecutar Consultas SQL</span>
      </div>
      <form onSubmit={handleSubmit} className="border_principal p-2">
        <div className="mb-3 mt-3">
          <label className="form-label float-start">Consulta SQL:</label>
          <textarea
            className="form-control"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={5}
            required
          />
        </div>
        <button type="submit" className="btn bg_secundario Blanco my-2">
          Ejecutar Consulta
        </button>
      </form>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" fullscreen>
        <Modal.Header>
          <Modal.Title>Resultado de la Consulta</Modal.Title>
          <Button variant="close" onClick={handleCloseModal}>
            <span aria-hidden="true"><FaTimes/></span>
          </Button>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <pre>{JSON.stringify(queryResult, null, 2)}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} className='bg_negro'>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SQLQueryForm;
