import { useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Badge, Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaCalendar } from 'react-icons/fa';
import axios from 'axios';
import { encryptionKey,decryptValue } from './hashes';
import Cookies from 'js-cookie';
import { url, urigoogle,UriLesson, uritutor } from './Urls';

const NextLessons = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);

  const toggleModal = () => setShowModal(!showModal);

  const onChange = (date) => {
    setDate(date);
  };

  const fetchLessons = async () => {
    try {
      //con el id de usuario
      const id = decryptValue(Cookies.get('#gt156'),encryptionKey);
      //llamamos a los datos del tutor
      const resp = await await axios.get(`${uritutor}/${id}`);
      //recuperamos el id de tutor
      const teacherId = resp.data.id;
      
      //llamamos todos los cursos del tutor
      const response = await axios.get(`${UriLesson}/${teacherId}`);
      console.log(response.data);
      
      const filteredLessons = response.data.filter(lesson => lesson.teacher_id === teacherId);
  
      console.log(filteredLessons);
      setLessons(filteredLessons);
    } catch (error) {
      console.error('Error al recuperar sesiones:', error);
    }
  };
  

  useEffect(() => {
    fetchLessons();
  }, []);

  const upcomingLessons = lessons
    .filter(lesson => parseISO(lesson.start_time) >= new Date())
    .slice(0, 3);

  return (
    <>
      <Card className="Principal mx-auto" style={{ width: '95%' }}>
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
            {upcomingLessons.length !==0 ?
            (upcomingLessons.map((lesson, index) => (
              <ListGroupItem key={index}>
                <div className='row'>
                  <div className='col-4 Principal'>
                    <div className="fw-bold my-auto">{format(parseISO(lesson.start_time), 'dd MMMM', { locale: es })}</div>
                    <Badge pill className='bg_secundario Blanco'>
                      {format(parseISO(lesson.start_time), 'h:mm a', { locale: es })} - {format(parseISO(lesson.end_time), 'h:mm a', { locale: es })}
                    </Badge>
                  </div>
                  <div className='col-8'>
                    <div className='row'>
                      <div className='Principal'>{lesson.title}</div>
                      <small className='Secundario'>{lesson.description}</small>
                      {lesson.google_meet_link && (
                        <div className='mt-2'>
                          <Button
                            variant="primary"
                            href={lesson.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Unirme
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            ))):(<>No hay lecciones pendientes</>)}
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
              .filter(lesson => isSameDay(parseISO(lesson.start_time), date))
              .map((lesson, index) => (
                <ListGroupItem key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{lesson.title}</strong>
                      <div><small>{format(parseISO(lesson.start_time), 'd MMMM yyyy', { locale: es })}</small></div>
                      {lesson.description && <div><small>{lesson.description}</small></div>}
                    </div>
                    <div className="text-end">
                      <Badge bg="primary">{format(parseISO(lesson.start_time), 'HH:mm', { locale: es })}</Badge>
                      {lesson.google_meet_link && (
                        <div className='mt-2'>
                          <Button
                            variant="primary"
                            href={lesson.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Unirme
                          </Button>
                        </div>
                      )}
                    </div>
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
};

export default NextLessons;
