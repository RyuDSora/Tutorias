import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function DashboardComponent() {

  // Ejemplo de imágenes locales (colocadas en la carpeta public/images)
  const images = [
    { url: '/images/slide1.png', alt: 'Imagen 1' },
    { url: '/images/slide2.png', alt: 'Imagen 2' },
    { url: '/images/slide3.png', alt: 'Imagen 3' },
    { url: '/images/slide4.jpg', alt: 'Imagen 4' },
  ];

  const courses = [
    { url: '/images/fisicabasica.jpg', alt: 'Curso 1', title: 'Física Básica' },
    { url: '/images/fisicaavanzada.jpg', alt: 'Curso 1', title: 'Física Avanzada' },
    { url: '/images/matebasica.jpg', alt: 'Curso 2', title: 'Matemáticas Basica' },
    { url: '/images/mateavanzada.jpg', alt: 'Curso 3', title: 'Matemáticas Avanazada' },
  ];

  const feedbacks = [
    { name: 'Juan Pérez', feedback: 'Excelente plataforma, los tutores son muy profesionales y las clases son muy amenas.', image: '/images/tutor1.jpg' },
    { name: 'María López', feedback: 'Gracias a esta plataforma, he mejorado mucho en mis estudios de física y matemáticas.', image: '/images/tutor2.jpg' },
    { name: 'Carlos García', feedback: 'Muy buena experiencia, recomiendo esta plataforma a todos los estudiantes.', image: '/images/tutor1.jpg' },
  ];

  return (
    <div className="bg-white">
      <ToastContainer />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="Principal uppercase text-center txt_lg f_regular" style={{ marginTop: '-40px' }}>Tutorías</div>  
        <div className="Secundario text-center f_principal">Encuentra al tutor perfecto para ti</div>
        
        {/* Carrusel de imágenes */}
        <Carousel autoPlay infiniteLoop showThumbs={false} interval={4000}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image.url} alt={image.alt} className="carousel-image"/>
            </div>
          ))}
        </Carousel>

        {/* Sección dividida en dos */}
        <div className="grid grid-cols-2 gap-8 mt-12" style={{ backgroundColor: '#336A41', padding: '20px', borderRadius: '8px' }}>
          {/* Lado izquierdo: Video con título */}
          <div className="col-span-1 flex flex-col justify-center items-center text-white">
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Asociate con Nosotros</h3>
            <video controls width="100%" style={{ maxWidth: '100%', height: 'auto' }}>
              <source src="/videos/tutorias.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
          
          {/* Lado derecho: Imagen */}
          <div className="col-span-1 flex justify-center items-center">
            <img src="/images/image4.png" alt="Imagen de la sección derecha" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>

        {/* Imagen debajo de la sección dividida en dos */}
        <div className="mt-8 flex justify-center">
          <img src="/images/image5.png" alt="Imagen debajo de la sección dividida" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>

        {/* Nuevo apartado */}
        <div className="mt-8 grid grid-cols-2 gap-8 items-center">
          {/* Imagen a la izquierda */}
          <div>
            <img src="/images/image6.jpg" alt="Imagen a la izquierda" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          {/* Texto a la derecha */}
          <div>
            <h3 className="text-lg text-gray-1000 font-bold" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
              Aprendizaje que a los estudiantes les encantará <br />
            </h3>
            <p className="text-lg text-gray-700" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
              Una asociación que te encantará <br />
            </p>
            <p className="text-lg text-gray-700" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
              Resultados que todos amarán
            </p>
          </div>
        </div>

        {/* Nuevo apartado de feedback */}
        <div className="feedback-section mt-8">
          <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>
            Comentarios de nuestros usuarios
          </h3>
          <div className="feedback-container flex justify-center space-x-4">
            {feedbacks.map((feedback, index) => (
              <div key={index} className="feedback-card">
                <img src={feedback.image} alt={feedback.name} className="h-20 w-20 rounded-full mb-4" />
                <h4 className="font-semibold mb-2">{feedback.name}</h4>
                <p className="text-gray-700">{feedback.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel de cursos */}
        <div className="courses-section mt-8">
          <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>Nuestros Cursos</h3>
          <Carousel autoPlay infiniteLoop showThumbs={false} interval={4000}>
            {courses.map((course, index) => (
              <div key={index} className="text-center">
                <p className="text-lg font-semibold" style={{ fontFamily: 'Clear Sans Light, sans-serif', color: '#336A41' }}>{course.title}</p>
                <img src={course.url} alt={course.alt} className="course-image" />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
