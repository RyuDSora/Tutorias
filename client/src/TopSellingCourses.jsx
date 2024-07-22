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

const generateRandomData = (numCourses) => {
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
  for (let i = 1; i <= numCourses; i++) {
    
    enrollments.push(Math.floor(Math.random() * 200) + 1); // Generate random enrollments between 1 and 200
    prices.push((Math.random() * 100).toFixed(2)); // Generate random prices between 0 and 100
    backgroundColors.push(colors[i % colors.length]); // Cycle through the colors array
  }

  return { courses, enrollments, prices, backgroundColors };
};

const { courses, enrollments, prices, backgroundColors } = generateRandomData(3); // Generate data for 3 courses

const data = {
  labels: courses,
  datasets: [
    {
      label: 'Number of Enrollments',
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
        label: (context) => `${context.label}: ${context.raw} enrollments`
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
      <Card.Body>
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
