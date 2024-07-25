import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Cursos.css';
import { UriCursos } from './components/Urls';
import axios from 'axios';


// Componente para mostrar la tarjeta de un curso
const CourseCard = ({ course }) => {
  const pre = '/images/'+course.imagen;
  return (
    <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
      <div className="card h-100">
        <img src={pre} alt={course.name} className="card-img-top" />
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
  const [cursos, setCursos]=useState([]);
  useEffect(()=>{
    const curses = async ()=>{
      try {
        const response = await axios.get(UriCursos);
        setCursos(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    curses();
  },[])
  return (
    <div className="container mt-5">
      <h1 className="title text-center mb-5">Nuestros Cursos</h1>
      <div className="row">
        {cursos.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Cursos;
