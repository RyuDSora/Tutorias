import React, { useState } from 'react';
import { Card, Table, Button, Modal, Alert } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const generateRandomData = () => {
  const courses = [];
  const enrollments = [];
  const prices = [];
  const backgroundColors = [];

  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)'
  ];



  for (let i = 1; i <= 4; i++) {
    backgroundColors.push(colors[i % colors.length]); 
  }

  return { courses, enrollments, prices, backgroundColors };
};

const { courses, enrollments, prices, backgroundColors } = generateRandomData(); 

const topCourses = courses
  .map((course, index) => ({
    course,
    enrollment: enrollments[index],
    price: prices[index],
    backgroundColor: backgroundColors[index]
  }))
  .sort((a, b) => b.enrollment - a.enrollment)
  .slice(0, 3);

const data = {
  labels: topCourses.map(c => c.course),
  datasets: [
    {
      label: 'Número de suscriptores',
      data: topCourses.map(c => c.enrollment),
      backgroundColor: topCourses.map(c => c.backgroundColor),
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw} suscriptores`
      }
    },
    title: {
      display: false,
      text: 'Cursos más vendidos',
    },
  },
  cutout: '0%',
};

const TopSellingCourses = () => {
  const [show, setShow] = useState(false);
  
  const totalEnrollments = enrollments.reduce((a, b) => a + b, 0);
  const totalRevenue = enrollments.reduce((sum, enrollment, index) => sum + enrollment * prices[index], 0).toFixed(2);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card className='mx-auto mb-3' style={{ width: '95%' }}>
        <Card.Body>
          {courses.length === 0 ? (
            <Alert variant="warning" className="text-center">
              <strong>No hay datos disponibles por el momento.</strong>
            </Alert>
          ) : (
            <div className='row'>
              <div className='col-lg-5 mb-3'>
                <div className='mx-auto' style={{ width: '90%' }}>
                  <Doughnut data={data} options={options} />
                  <div className='mt-3'>
                    <strong>Total</strong><br />Lps {totalRevenue}
                  </div>
                </div>
              </div>
              <div className='col-lg-7 my-auto'>
                <Card.Title className='mt-3 Principal'>Cursos más vendidos</Card.Title>
                <div style={{overflowX: 'auto' }}>
                  <Table bordered responsive className='border'>
                    <thead >
                      <tr className="text-center">
                        <th>Curso</th>
                        <th>Suscrip.</th>
                        <th>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCourses.map((course, index) => (
                        <tr key={index} className="text-center">
                          <td style={{ color: course.backgroundColor }}>{course.course}</td>
                          <td>{course.enrollment}</td>
                          <td>Lps {course.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div>
                  <Button variant="link" style={{ float: 'right' }} onClick={handleShow}>Ver todo ({courses.length})</Button>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Todos los Cursos</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowX: 'auto' }}>
          {courses.length === 0 ? (
            <Alert variant="warning" className="text-center">
              <strong>No hay cursos disponibles.</strong>
            </Alert>
          ) : (
            <Table bordered responsive>
              <thead>
                <tr className="text-center">
                  <th>Curso</th>
                  <th>Suscrip.</th>
                  <th>Precio</th>
                  <th>Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index} className="text-center">
                    <td style={{ color: backgroundColors[index] }}>{course}</td>
                    <td>{enrollments[index]}</td>
                    <td>Lps {prices[index].toFixed(2)}</td>
                    <td>Lps {(enrollments[index] * prices[index]).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-center">
                  <td colSpan="3"><strong>Total Ingresos:</strong></td>
                  <td>Lps {totalRevenue}</td>
                </tr>
              </tfoot>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className='bg_negro'>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TopSellingCourses;
