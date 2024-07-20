import React from 'react';


const tutors = [
  { id: 1, name: 'Juan Pérez', description: 'Especialista en física con más de 5 años de experiencia enseñando en Honduras.', image: '/images/tutor1.jpg' },
  { id: 2, name: 'María López', description: 'Profesora de matemáticas apasionada por hacer que los números sean fáciles de entender.', image: '/images/tutor2.jpg' },
  { id: 3, name: 'Carlos García', description: 'Físico con un enfoque en la enseñanza práctica y experimentos en clase.', image: '/images/tutor1.jpg' },
  { id: 4, name: 'Ana Martínez', description: 'Experta en matemáticas aplicadas con experiencia en tutorías personalizadas.', image: '/images/tutor2.jpg' },
  { id: 5, name: 'Luis Rodríguez', description: 'Docente de física con un enfoque en la comprensión de conceptos teóricos y prácticos.', image: '/images/tutor1.jpg' },
  { id: 6, name: 'Sofía Hernández', description: 'Maestra de matemáticas con más de 10 años de experiencia en la educación secundaria.', image: '/images/tutor2.jpg' },
  { id: 7, name: 'Miguel Fernández', description: 'Tutor de física con experiencia en preparación para exámenes y olimpiadas científicas.', image: '/images/tutor1.jpg' },
  { id: 8, name: 'Laura Gómez', description: 'Especialista en matemáticas básicas y avanzadas con métodos de enseñanza innovadores.', image: '/images/tutor2.jpg' },

];


const TutorCard = ({ tutor }) => {
  return (
    <div style={styles.card}>
      <img src={tutor.image} alt={tutor.name} style={styles.image} />
      <div style={styles.textContainer}>
        <h3>{tutor.name}</h3>
        <p>{tutor.description}</p>
      </div>
    </div>
  );
};


const Tutores = () => {
  return (
    <div>
      <h1 style={styles.title}>Nuestros Tutores</h1>
      <div style={styles.gridContainer}>
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </div>
  );
};


const styles = {
  title: {
    textAlign: 'center',
    fontFamily: 'Clear Sans Light, sans-serif',
    color: '#336A41',
    marginBottom: '10px',
    marginTop: '32px',
    fontSize: '36px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    padding: '16px',
  },
  card: {
    border: '2px solid #336A41',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Clear Sans Light, sans-serif',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '100px',
  },
  textContainer: {
    marginTop: '16px',
  },
};

export default Tutores;
