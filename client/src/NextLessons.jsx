import React, { useState } from 'react';
import { Card, ListGroup, ListGroupItem, Badge, Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaCalendar } from 'react-icons/fa';

const NextLessons = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());

  const lessons = [
    {
      date: '2024-07-22',
      title: 'Matemática Básica',
      description: 'Aprende a sumar, restar, multiplicar y dividir',
      time: '8:00 AM'
    },
    {
      date: '2024-08-01',
      title: 'Física elemental',
      description: 'Comportamiento de los fluidos',
      time: '10:00 AM'
    },
    { 
      date: '2024-08-02', 
      title: 'Biología', 
      description: 'Introducción a la biología molecular', 
      time: '11:00 AM' 
    },
    { 
      date: '2024-08-03', 
      title: 'Historia', 
      description: 'Historia antigua y medieval', 
      time: '1:00 PM' 
    },
    { 
      date: '2024-08-04', 
      title: 'Geografía', 
      description: 'Geografía física y humana', 
      time: '2:00 PM' 
    },
    { 
      date: '2024-08-05', 
      title: 'Inglés', 
      description: 'Gramática y vocabulario', 
      time: '8:00 AM' 
    },
    { 
      date: '2024-08-06', 
      title: 'Español', 
      description: 'Literatura y composición', 
      time: '10:00 AM' 
    },
    { 
      date: '2024-08-07', 
      title: 'Educación Física', 
      description: 'Ejercicio y bienestar', 
      time: '12:00 PM' 
    },
    { 
      date: '2024-08-08', 
      title: 'Música', 
      description: 'Teoría musical y práctica', 
      time: '3:00 PM' 
    },
    { 
      date: '2024-08-09', 
      title: 'Arte', 
      description: 'Historia del arte y técnicas', 
      time: '4:00 PM' 
    },
    { 
      date: '2024-08-10', 
      title: 'Tecnología', 
      description: 'Tecnología de la información', 
      time: '5:00 PM' 
    },
    { 
      date: '2024-08-11', 
      title: 'Cívica', 
      description: 'Educación cívica y ética', 
      time: '6:00 PM' 
    },
    { 
      date: '2024-08-12', 
      title: 'Cultura', 
      description: 'Estudios culturales', 
      time: '7:00 PM' 
    },
    { 
      date: '2024-08-13', 
      title: 'Filosofía', 
      description: 'Introducción a la filosofía', 
      time: '8:00 PM' 
    },
    { 
      date: '2024-08-14', 
      title: 'Religión', 
      description: 'Estudios religiosos', 
      time: '9:00 PM' 
    },
    { 
      date: '2024-08-15', 
      title: 'Matemáticas Avanzadas', 
      description: 'Cálculo y álgebra avanzada', 
      time: '10:00 PM' 
    },
  ];

  const toggleModal = () => setShowModal(!showModal);

  const onChange = (date) => {
    setDate(date);
  };

  const upcomingLessons = lessons
    .filter(lesson => parseISO(lesson.date) >= new Date())
    .slice(0, 3);

  return (
    <>
      <Card className="Principal mx-auto" style={{width:'95%'}}>
        <Card.Title className='mt-3 Principal mx-3'>
          <div className='d-flex justify-content-between'>
            <span className='h5'>Próximas Lecciones</span>
            <a onClick={toggleModal} className="text-primary" style={{ cursor: 'pointer' }}>
              <span className='h6' title='Ver Calendario'><FaCalendar className="icon Secundario" style={{ width: 20, height: 20 }} /></span>
            </a>
          </div>
        </Card.Title>
        <hr />
        <Card.Body>
          <ListGroup variant="flush">
            {upcomingLessons.map((lesson, index) => (
              <ListGroupItem key={index}>
                <div className='row'>
                  <div className='col-4 Principal'>
                    <div className="fw-bold my-auto">{format(parseISO(lesson.date), 'dd MMMM', { locale: es })}</div>
                    <Badge pill className='bg_secundario Blanco'>
                      {lesson.time}
                    </Badge>
                  </div>
                  <div className='col-8'>
                    <div className='row'>
                      <div className='Principal'>{lesson.title}</div>
                      <small className='Secundario'>{lesson.description}</small>
                    </div>
                    
                  </div>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={toggleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Calendario de Sesiones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar onChange={onChange} value={date} />
          <ListGroup className="mt-3">
            {lessons
              .filter(lesson => isSameDay(parseISO(lesson.date), date))
              .map((lesson, index) => (
                <ListGroupItem key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{lesson.title}</strong>
                      <div><small>{format(parseISO(lesson.date), 'd MMMM yyyy', { locale: es })}</small></div>
                      {lesson.description && <div><small>{lesson.description}</small></div>}
                    </div>
                    <Badge bg="primary">{lesson.time}</Badge>
                  </div>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal} className='bg_negro'>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NextLessons;
