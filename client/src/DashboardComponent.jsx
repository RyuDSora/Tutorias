import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function DashboardComponent() {

  const images = [
    { url: '/images/slide1.png', alt: 'Imagen 1' },
    { url: '/images/slide2.png', alt: 'Imagen 2' },
    { url: '/images/slide3.png', alt: 'Imagen 3' },
    { url: '/images/slide4.jpg', alt: 'Imagen 4' },
  ];

  const courses = [
    { url: '/images/fisicabasica.jpg', alt: 'Curso 1', title: 'Física Básica' },
    { url: '/images/fisicaavanzada.jpg', alt: 'Curso 1', title: 'Física Avanzada' },
    { url: '/images/matebasica.jpg', alt: 'Curso 2', title: 'Matemáticas Básica' },
    { url: '/images/mateavanzada.jpg', alt: 'Curso 3', title: 'Matemáticas Avanzada' },
  ];

  const feedbacks = [
    { name: 'Juan Pérez', feedback: 'Excelente plataforma, los tutores son muy profesionales y las clases son muy amenas.', image: '/images/tutor1.jpg' },
    { name: 'María López', feedback: 'Gracias a esta plataforma, he mejorado mucho en mis estudios de física y matemáticas.', image: '/images/tutor2.jpg' },
    { name: 'Carlos García', feedback: 'Muy buena experiencia, recomiendo esta plataforma a todos los estudiantes.', image: '/images/tutor1.jpg' },
  ];

  return (
    <div className="bg-white">
      <ToastContainer />
      <div className="container py-8">
        <div className="text-center">
          <h1 className="Principal uppercase txt_lg f_regular" style={{ marginTop: '-20px' }}>Tutorías</h1>
          <h2 className="Secundario f_principal">Encuentra al tutor perfecto para ti</h2>
        </div>
        
        {/* Carrusel de imágenes */}
        <Carousel autoPlay infiniteLoop showThumbs={false} interval={4000}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image.url} alt={image.alt} className="carousel-image"/>
            </div>
          ))}
        </Carousel>

        {/* Sección dividida en dos */}
        <div className="row mt-5" style={{ backgroundColor: '#336A41', padding: '20px', borderRadius: '8px' }}>
          {/* Lado izquierdo: Video con título */}
          <div className="col-md-6 text-white d-flex flex-column justify-content-center align-items-center">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Asociate con Nosotros</h3>
            <video controls className="w-100">
              <source src="/videos/tutorias.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
          
          {/* Lado derecho: Imagen */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <img src="/images/image4.png" alt="Imagen de la sección derecha" className="img-fluid" />
          </div>
        </div>

        {/* Imagen debajo de la sección dividida en dos */}
        <div className="mt-4 d-flex justify-content-center">
          <img src="/images/image5.png" alt="Imagen debajo de la sección dividida" className="img-fluid" />
        </div>

        {/* Nuevo apartado */}
        <div className="row mt-5">
          {/* Imagen a la izquierda */}
          <div className="col-md-6">
            <img src="/images/image6.jpg" alt="Imagen a la izquierda" className="img-fluid" />
          </div>
         {/* Texto a la derecha */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
        <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
            Aprendizaje que a los estudiantes les encantará <br />
          </h3>
          <p className="text-lg text-center" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
            Una asociación que te encantará <br />
          </p>
          <p className="text-lg text-center" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
            Resultados que todos amarán
          </p>
        </div>
        </div>

        {/* Nuevo apartado de feedback */}
        <div className="mt-5">
          <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
            Comentarios de nuestros usuarios
          </h3>
          <div className="d-flex justify-content-center flex-wrap">
            {feedbacks.map((feedback, index) => (
              <div key={index} className="feedback-card m-3 text-center">
                <img src={feedback.image} alt={feedback.name} className="rounded-circle mb-2" style={{ width: '200px', height: '200px' }} />
                <h4 className="font-semibold mb-2">{feedback.name}</h4>
                <p className="text-gray-700">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel de cursos */}
        <div className="mt-5">
          <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>Nuestros Cursos</h3>
          <Carousel autoPlay infiniteLoop showThumbs={false} interval={4000}>
            {courses.map((course, index) => (
              <div key={index} className="text-center">
                <p className="text-lg font-semibold" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>{course.title}</p>
                <img src={course.url} alt={course.alt} className="course-image img-fluid" style={{ maxWidth: '5 0%', height: 'auto' }} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
