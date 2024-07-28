import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function AboutUs() {
    const paragraphs = [
        {
            text: "¡Bienvenido a nuestra plataforma!",
            //imageUrl: "/logos/logo_0_primary-color-positive.jpg",
        },
        {
            text: "Somos Tutorias",
            //imageUrl: "/logos/logo_1_secondary-color-positive.jpg",
        },
        {
            text: "Conectamos Tutores",
            //imageUrl: "/logos/logo_2_black-white-positive.jpg",
        },
        {
            text: "con Estudiantes",
            //imageUrl: "/logos/logo_3_white-negative-on-primary.jpg",
        },
        {
            text: "¡Déjanos ser parte de tus momentos!",
            //imageUrl: "/logos/logo_4_white-negative.jpg",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % paragraphs.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container-fluid">
            <div className="w-50 mx-auto my-3">
                <div className="d-flex justify-content-center">
                    <span className="text-center h1 Principal">Acerca de Nosotros</span>
                </div>
            </div>
            <div className="w-75 mx-auto">
                <div className="">
                    {paragraphs.map((paragraph, index) => (
                        <div
                            key={index}
                            /*className={`transition-opacity ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}*/
                            style={{
                                /*backgroundImage: `url(${paragraph.imageUrl})`,*/
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                transition: 'opacity 1s ease-in-out'
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <span className="bg_secundario bg-opacity-50 Blanco p-3 h3 text-center rounded-3">
                                    {paragraph.text}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
