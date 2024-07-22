import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components with ChartJS
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
  courses.push(`Matematicas`);
  courses.push(`Fisica`);
  courses.push(`Ingles`);
  courses.push(`Ingles II`);

  enrollments.push(35)
  enrollments.push(45)
  enrollments.push(15)
  enrollments.push(5)

  prices.push(15.20);
  prices.push(20.00);
  prices.push(11.99);
  prices.push(6.99);
  for (let i = 1; i <= 4; i++) {
    backgroundColors.push(colors[i % colors.length]); 
  }

  return { courses, enrollments, prices, backgroundColors };
};

const { courses, enrollments, prices, backgroundColors } = generateRandomData(); // Generate data for 3 courses

const data = {
  labels: courses,
  datasets: [
    {
      label: 'Número de suscriptores',
      data: enrollments,
      backgroundColor: backgroundColors,
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
      display: true,
      text: 'Cursos más vendidos',
    },
  },
  cutout: '70%', // Adjust to create a donut effect
};

const TopSellingCourses = () => {
  const totalEnrollments = enrollments.reduce((a, b) => a + b, 0);
  const totalRevenue = enrollments.reduce((sum, enrollments, index) => sum + enrollments * prices[index], 0).toFixed(2);

  return (
    <Card>
      <Card.Body >
        <Card.Title>Cursos más vendidos</Card.Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '1' }}>
            <Doughnut data={data} options={options} />
            <div style={{ position: 'absolute', left: '24%', top: '55%', transform: 'translate(-50%, -50%)' }}>
              <strong>Total</strong><br />${totalRevenue}
            </div>
          </div>
          <div style={{ flex: '1' }}>
            <Table borderless>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Inscripciones</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td style={{ color: backgroundColors[index] }}>{course}</td>
                    <td>{enrollments[index]}</td>
                    <td>${prices[index]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        <a href="#" style={{ float: 'right' }}>Ver todo ({courses.length})</a>
      </Card.Body>
    </Card>
  );
}

export default TopSellingCourses;
