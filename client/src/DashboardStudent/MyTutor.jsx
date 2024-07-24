import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const CourseTitle = styled.h2`
  cursor: pointer;
  margin-top: 20px;
  display: flex;
  align-items: center;
`;

const ListGroupItem = styled.li`
  list-style-type: none;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const StudentName = styled.h5`
 
`;

const StudentDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const Mytutor = () => {
  const [show, setShow] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = (student) => {
    setSelectedStudent(student);
    setShow(true);
  };

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  // Datos de prueba
  const courses = [
    {
      id: 1,
      name: 'Matemáticas',
      students: [
        { id: 1, name: 'Juan Pérez', description: 'Estudiante de primer año, apasionado por las matemáticas.' },
        { id: 2, name: 'Ana García', description: 'Estudiante de segundo año, excelente en física.' }
      ]
    },
    {
      id: 2, name: 'Física',
      students: [
        { id: 3, name: 'Carlos López', description: 'Estudiante de tercer año, destacando en inglés.' }
      ]
    },
    {
      id: 3, name: 'Inglés',
      students: [
        { id: 4, name: 'María Martínez', description: 'Estudiante de cuarto año, sobresaliente en inglés.' }
      ]
    }
  ];

  return (
    <>
      <div><span className='h3 Principal f_principal'>Tus Estudiantes</span></div>
      {courses.map(course => (
        <div key={course.id}>
          <CourseTitle onClick={() => toggleCourse(course.id)} className='Principal'>
            <div>{course.name} </div>
            <div>{expandedCourses[course.id] ? <FaChevronUp /> : <FaChevronDown />}</div> 
          </CourseTitle>
          {expandedCourses[course.id] && (
            <ul className="list-group">
              {course.students.map((student, index) => (
                <ListGroupItem key={student.id}>
                  <div className='d-flex justify-content-between align-content-center'>
                    <div className='py-2 Secundario'>
                      <span>{index + 1}.- </span>
                      <span> {student.name}</span>
                    </div>
                    <div className=''>
                      <Button variant="primary" className='bg_secundario' onClick={() => handleShow(student)}>
                        Más información
                      </Button>
                    </div>
                  </div>
                </ListGroupItem>
              ))}
            </ul>
          )}
        </div>
      ))}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent?.description}
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

export default Mytutor;
