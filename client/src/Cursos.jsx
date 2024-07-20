import React from 'react';
import './Cursos.css';

// Lista de cursos con datos de ejemplo
const courses = [
  { id: 1, name: 'Física Básica', description: 'Cinemática, Dinámica, Leyes de Newton, Trabajo y Energía.', image: '/images/fisicabasica.jpg' },
  { id: 2, name: 'Física Avanzada', description: 'Termodinámica, Electromagnetismo, Óptica, Física Moderna.', image: '/images/fisicaavanzada.jpg' },
  { id: 3, name: 'Matemáticas Básicas', description: 'Aritmética, Álgebra, Geometría, Trigonometría.', image: '/images/matebasica.jpg' },
  { id: 4, name: 'Matemáticas Avanzadas', description: 'Cálculo Diferencial, Cálculo Integral, Álgebra Lineal, Ecuaciones Diferenciales.', image: '/images/mateavanzada.jpg' },
  // agrega más cursos según sea necesario
];

// Componente para mostrar la tarjeta de un curso
const CourseCard = ({ course }) => {
  return (
    <div className="card">
      <img src={course.image} alt={course.name} className="image" />
      <div className="textContainer">
        <h3 className="name">{course.name}</h3>
        <p className="description">{course.description}</p>
      </div>
    </div>
  );
};

// Componente principal para mostrar la cuadrícula de cursos
const Cursos = () => {
  return (
    <div>
      <h1 className="title">Nuestros Cursos</h1>
      <div className="gridContainer">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Cursos;
