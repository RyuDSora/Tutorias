import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, ListGroup } from 'react-bootstrap';
import { UriCursos } from '../components/Urls';
import Cookies from 'js-cookie';
import axios from 'axios';

const MyCourses = () => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([
    { id: 1, name: 'Matemáticas', description: 'Aprende los fundamentos de las matemáticas.' },
    { id: 2, name: 'Física', description: 'Descubre los principios de la física.' },
    { id: 3, name: 'Inglés', description: 'Mejora tus habilidades en el idioma inglés.' },
  ]);
  const [cursosSelect, setCursosSelect] = useState([]);

  useEffect(() => {
    const fetchSubject = async () => {
      if (Cookies.get('session')) {
        try {
          const response = await axios.get(UriCursos);
          setCursosSelect(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchSubject();
  }, [Cookies.get('session')]);

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleShow = (course) => {
    setSelectedCourse(course);
    setShow(true);
  };
  const handleShow2 = () => {
    setShow2(true);
  };

  const addCourse = async (courseId) => {
    const tutorId = Cookies.get('userId'); // Asumiendo que el ID del tutor está guardado en las cookies

    try {
      await axios.post(`${UriCursos}/add`, {
        tutorId,
        courseId,
      });
      // Aquí puedes actualizar la lista de cursos del tutor si lo deseas
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <>
      <div><span className='h3 Principal f_principal'>Tus Cursos</span></div>
      <div className='row justify-content-end py-3'>
        <Button variant="secondary" className='bg_principal Blanco w-25' onClick={handleShow2}>
          Add new
        </Button>
      </div>
      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title className='Principal'>{course.name}</Card.Title>
                <Card.Text className='Secundario'>
                  {course.description}
                </Card.Text>
                <Button variant="primary" className='bg_secundario Blanco' onClick={() => handleShow(course)}>
                  Más información
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse?.description}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title className='Principal f_principal'>Selecciona un curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {cursosSelect.map(course => (
              <ListGroup.Item key={course.id} action onClick={() => addCourse(course.id)}>
                {course.id+".- "}{course.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='bg_secundario' onClick={handleClose2}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyCourses;
