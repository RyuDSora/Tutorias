import React from 'react';
import './tutores.css';

// Lista de tutores con datos de ejemplo
const tutors = [
  { id: 1, name: 'Juan Pérez', description: 'Especialista en física con más de 5 años de experiencia enseñando en Honduras.', image: '/images/tutor1.jpg' },
  { id: 2, name: 'María López', description: 'Profesora de matemáticas apasionada por hacer que los números sean fáciles de entender.', image: '/images/tutor2.jpg' },
  { id: 3, name: 'Carlos García', description: 'Físico con un enfoque en la enseñanza práctica y experimentos en clase.', image: '/images/tutor1.jpg' },
  { id: 4, name: 'Ana Martínez', description: 'Experta en matemáticas aplicadas con experiencia en tutorías personalizadas.', image: '/images/tutor2.jpg' },
  { id: 5, name: 'Luis Rodríguez', description: 'Docente de física con un enfoque en la comprensión de conceptos teóricos y prácticos.', image: '/images/tutor1.jpg' },
  { id: 6, name: 'Sofía Hernández', description: 'Maestra de matemáticas con más de 10 años de experiencia en la educación secundaria.', image: '/images/tutor2.jpg' },
  { id: 7, name: 'Miguel Fernández', description: 'Tutor de física con experiencia en preparación para exámenes y olimpiadas científicas.', image: '/images/tutor1.jpg' },
  { id: 8, name: 'Laura Gómez', description: 'Especialista en matemáticas básicas y avanzadas con métodos de enseñanza innovadores.', image: '/images/tutor2.jpg' },
  // agrega más tutores según sea necesario
];

// Componente para mostrar la tarjeta de un tutor
const TutorCard = ({ tutor }) => {
  return (
    <div className="card">
      <img src={tutor.image} alt={tutor.name} className="image" />
      <div className="textContainer">
        <h3 className="name">{tutor.name}</h3>
        <p className="description">{tutor.description}</p>
      </div>
    </div>
  );
};

// Componente principal para mostrar la cuadrícula de tutores
const Tutores = () => {
  return (
    <div>
      <h1 className="title">Nuestros Tutores</h1>
      <div className="gridContainer">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </div>
  );
};

export default Tutores;
