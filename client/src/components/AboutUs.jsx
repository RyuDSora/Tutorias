import React, { useState, useEffect } from "react";

function AboutUs() {
    const paragraphs = [
        {
            text: "¡Bienvenido a nuestra tienda de productos para celebraciones!",
            imageUrl: "/qpexels-dana-miller-1264919.jpg",
        },
        {
            text: "En nuestro establecimiento, nos apasiona ayudarte a crear momentos inolvidables a través de productos y accesorios temáticos para todo tipo de celebraciones. Desde fiestas de cumpleaños y aniversarios hasta eventos especiales y días festivos, nos dedicamos a ofrecerte todo lo que necesitas para hacer de cada ocasión un momento único y especial.",
            imageUrl: "/pexels-karolina-grabowska-5725977.jpg",
        },
        {
            text: "Nos especializamos en satisfacer las necesidades de nuestros clientes, por lo que también ofrecemos productos personalizados y personalizables para que puedas hacer realidad tus ideas y sueños. Ya sea que estés planeando una fiesta temática, una celebración especial o simplemente quieres añadir un toque festivo a tu hogar, estamos aquí para acompañarte en cada paso del proceso.",
            imageUrl: "/pexels-tim-douglas-6210756.jpg",
        },
        {
            text: "En nuestra tienda encontrarás una amplia variedad de productos, desde desechables y decoraciones hasta accesorios temáticos que harán que tus celebraciones sean inolvidables. Nuestro compromiso es brindarte calidad, variedad y la mejor experiencia de compra para que puedas confiar en nosotros como tu aliado en cada celebración.",
            imageUrl: "/qpexels-israel-piña-11690682.jpg",
        },
        {
            text: "¡Déjanos ser parte de tus momentos más especiales y juntos hagamos de cada celebración un motivo de alegría y felicidad!",
            imageUrl: "/pexels-polina-tankilevitch-4110012.jpg",
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
        <div className="h-screen w-full overflow-hidden flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-serif text-center py-4">Acerca de</h1>
            <div className="relative h-full w-full">
                {paragraphs.map((paragraph, index) => (
                    <div key={index} className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-cover bg-center transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${paragraph.imageUrl})` }}>
                        <div className="bg-black bg-opacity-50 text-white p-8">
                            <h2 className="text-2xl md:text-4xl text-center font-serif">{paragraph.text}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AboutUs;