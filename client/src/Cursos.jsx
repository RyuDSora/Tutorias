import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
      <div className="card h-100">
        <img src={course.image} alt={course.name} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{course.name}</h5>
          <p className="card-text">{course.description}</p>
        </div>
      </div>
    </div>
  );
};

// Componente principal para mostrar la cuadrícula de cursos
const Cursos = () => {
  return (
    <div className="container mt-5">
      <h1 className="title text-center mb-5">Nuestros Cursos</h1>
      <div className="row">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Cursos;
