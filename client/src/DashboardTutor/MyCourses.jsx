import React, { useEffect, useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { UriCursos } from '../components/Urls'; 
import Cookies from 'js-cookie';
import axios from 'axios';

const MyCourses = () => {
  const [show, setShow] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect (()=>{
    const fetchSubject = async () => {
      if (Cookies.get('session')) {
        try {
          const response = await axios.get(UriCursos);
          console.log(response.data);
        } catch (error) {
          console.error(error); 
        }
      }
    };

    fetchSubject();
  }, [Cookies.get('session')]);
  const handleClose = () => setShow(false);
  const handleShow = (course) => {
    setSelectedCourse(course);
    setShow(true);
  };

  // Datos de prueba
  const courses = [
    { id: 1, name: 'Matemáticas', description: 'Aprende los fundamentos de las matemáticas.' },
    { id: 2, name: 'Física', description: 'Descubre los principios de la física.' },
    { id: 3, name: 'Inglés', description: 'Mejora tus habilidades en el idioma inglés.' },
  ];

  return (
    <>
      <div><span className='h3 Principal f_principal'>Tus Cursos</span></div>
      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-4 mb-4">
            <Card>
              <Card.Body>
                <Card.Title className=' Principal'>{course.name}</Card.Title>
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
    </>
  );
};

export default MyCourses;
